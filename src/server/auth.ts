import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
import { type Student } from "@prisma/client";
import { hash, verify } from "argon2";
import Credentials from "next-auth/providers/credentials";
import * as siakadClient from "./siakad-client";
import { env } from "~/env.mjs";
import * as logger from "./utils/logger";
import { prisma } from "./db";
import { wrapResult } from "~/utils/wrap-result";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt({ token, user }) {
			if (user !== undefined) {
				token.id = user.id;
				token.nim = user.nim;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user !== undefined) {
				session.user = {
					id: token.id,
					nim: token.nim,
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
			async authorize(credentials): Promise<Pick<Student, "id" | "nim" | "name" | "photo">> {
				if (credentials === undefined) throw new Error("Invalid credentials");

				let user = await prisma.student.findFirst({
					where: { nim: credentials.nim },
					select: {
						id: true,
						nim: true,
						name: true,
						password: true,
						photo: true,
					},
				});

				// create a user on their initial login
				if (user === null) {
					logger.info("Creating user from SIAKAD");
					const canSignIn = await siakadClient.login({
						fresh: true,
						nim: credentials.nim,
						password: credentials.password,
					});
					if (!canSignIn) throw new Error("Incorrect username / password");

					const [studentData, studentError] = await wrapResult(siakadClient.collectStudentData());
					if (studentError !== null) throw new Error("Failed to collect student's data");

					const hashedPassword = await hash(credentials.password);

					const [cookie, cookieError] = await wrapResult(siakadClient.collectCookies({ immediate: true }));
					if (cookieError !== null) throw new Error("Failed to collect student's cookies");

					logger.info("Saving user to database");
					user = await prisma.student.create({
						data: {
							...studentData,
							role: credentials.nim === env.ADMIN_NIM ? "admin" : "member",
							password: hashedPassword,
							cookie: cookie,
						},
						select: {
							id: true,
							nim: true,
							name: true,
							password: true,
							photo: true,
							role: true,
						},
					});
				}

				const isPasswordMatch = await verify(user.password, credentials.password);
				if (!isPasswordMatch) throw new Error("Incorrect password");

				return {
					id: user.id,
					nim: user.nim,
					name: user.name,
					photo: user.photo,
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
