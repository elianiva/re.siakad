import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import { prisma } from "./db";
import Credentials from "next-auth/providers/credentials";
import { hash, verify } from "argon2";
import * as siakadClient from "./siakad-client";
import * as logger from "./utils/logger";
import { type Student } from "@prisma/client";
import { env } from "~/env.mjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt({ token, user }) {
			if (user !== undefined) {
				token.id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				// @ts-expect-error - ignore for now
				session.user.id = token.id as string;
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
						nim: credentials.nim,
						password: credentials.password,
					});
					if (!canSignIn) throw new Error("Incorrect username / password");

					const studentData = await siakadClient.collectStudentData();
					const hashedPassword = await hash(credentials.password);

					logger.info("Saving user to database");
					user = await prisma.student.create({
						data: {
							...studentData,
							role: credentials.nim === env.ADMIN_NIM ? "admin" : "member",
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

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
