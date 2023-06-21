import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
import { type Student } from "@prisma/client";
import { hash, verify } from "argon2";
import Credentials from "next-auth/providers/credentials";
import * as siakadClient from "./siakad-client";
import { env } from "~/env.mjs";
import { prisma } from "./db";
import { wrapResult } from "~/utils/wrap-result";
import { sentry } from "./utils/sentry";

type AuthenticatedStudent = Pick<Student, "id" | "nim" | "name" | "photo"> & {
	cookie: string;
};

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt({ token, user }) {
			if (user !== undefined) {
				token.id = user.id;
				token.nim = user.nim;
				token.cookie = user.cookie;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user !== undefined) {
				session.user = {
					id: token.id,
					nim: token.nim,
					cookie: token.cookie,
				} as User;
			}
			return session;
		},
	},
	providers: [
		Credentials({
			name: "credentials",
			credentials: {
				nim: { label: "NIM", type: "text", placeholder: "2241720000" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "password",
				},
			},
			async authorize(credentials): Promise<AuthenticatedStudent> {
				if (credentials === undefined) throw new Error("Invalid credentials");

				// need to reassign the `user` but not the `findUserError`
				// eslint-disable-next-line prefer-const
				let [student, findUserError] = await wrapResult(
					prisma.student.findFirst({
						where: { nim: credentials.nim },
						select: {
							id: true,
							nim: true,
							name: true,
							password: true,
							photo: true,
						},
					})
				);
				if (findUserError !== null) {
					sentry.captureException(findUserError, (scope) => {
						scope.setContext("student", { nim: credentials.nim });
						return scope;
					});
					throw new Error("Failed to find a student with the given credentials");
				}

				// create a user on their initial login
				let studentCookie = "";
				if (student === null) {
					const [canSignIn, loginError] = await wrapResult(
						siakadClient.login({
							fresh: true,
							nim: credentials.nim,
							password: credentials.password,
						})
					);
					if (loginError !== null) {
						sentry.captureException(findUserError, (scope) => {
							scope.setContext("student", { nim: credentials.nim });
							return scope;
						});
						throw new Error("Failed to login to the internal SIAKAD");
					}
					if (!canSignIn) throw new Error("Incorrect username / password");

					const [studentData, studentError] = await wrapResult(siakadClient.collectStudentData());
					if (studentError !== null) {
						sentry.captureException(studentError, (scope) => {
							scope.setContext("student", { nim: credentials.nim });
							return scope;
						});
						throw new Error("Failed to collect student's data");
					}

					const hashedPassword = await hash(credentials.password);

					// immediately return the cookie since we've collected the cookies when we're calling `collectStudentData()`
					const [cookie, cookieError] = await wrapResult(siakadClient.collectCookies({ immediate: true }));
					if (cookieError !== null) {
						sentry.captureException(cookieError, (scope) => {
							scope.setContext("student", { nim: credentials.nim });
							return scope;
						});
						throw new Error("Failed to collect student's cookies");
					}
					studentCookie = cookie;

					const [newStudent, createStudentError] = await wrapResult(
						prisma.student.create({
							data: {
								...studentData,
								role: env.ADMIN_NIMS.includes(credentials.nim) ? "admin" : "member",
								password: hashedPassword,
							},
							select: {
								id: true,
								nim: true,
								name: true,
								password: true,
								photo: true,
								role: true,
							},
						})
					);
					if (createStudentError !== null) {
						sentry.captureException(createStudentError, (scope) => {
							scope.setContext("student", { nim: credentials.nim });
							return scope;
						});
						throw new Error("Failed to create a new user");
					}
					student = newStudent;
				}

				const isPasswordMatch = await verify(student.password, credentials.password);
				if (!isPasswordMatch) throw new Error("Incorrect password");

				// collect cookies for existing student
				const [cookie, cookieError] = await wrapResult(
					siakadClient.collectCookies({
						credentials: { nim: credentials.nim, password: credentials.password },
					})
				);
				if (cookieError !== null) {
					sentry.captureException(cookieError, (scope) => {
						scope.setContext("student", { nim: credentials.nim });
						return scope;
					});
					throw new Error("Failed to collect student's cookies");
				}
				studentCookie = cookie;

				return {
					id: student.id,
					nim: student.nim,
					name: student.name,
					photo: student.photo,
					cookie: studentCookie,
				};
			},
		}),
	],
	pages: {
		signIn: "/sign-in",
	},
};

export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
