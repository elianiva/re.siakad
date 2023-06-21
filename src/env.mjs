import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z.enum(["development", "test", "production"]),
		NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string().min(1) : z.string().url()
		),
		DB_CONTAINER_NAME: z.string().min(1).optional(),
		DB_USERNAME: z.string().min(1).optional(),
		DB_PASSWORD: z.string().min(1).optional(),
		DB_DATABASE: z.string().min(1).optional(),
		DB_PORT: z.coerce.number().optional(),
		SIAKAD_URL: z.string().url(),
		SLC_URL: z.string().url(),
		LMS_URL: z.string().url(),
		ADMIN_NIMS: z.string().transform((str) => str.split(",")),
		BLACKLISTED_COURSES: z.string().transform((str) => str.split(",")),
		MINIO_ENDPOINT: z.string().min(1),
		MINIO_PORT: z.coerce.number().optional(),
		MINIO_ACCESS_KEY: z.string().min(1),
		MINIO_SECRET_KEY: z.string().min(1),
		MINIO_BUCKET_NAME: z.string().min(1),
		SENTRY_DSN: z.string().url(),
		LOGTAIL_TOKEN: z.string(),
		CALENDAR_ID: z.string(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		DB_CONTAINER_NAME: process.env.DB_CONTAINER_NAME,
		DB_USERNAME: process.env.DB_USERNAME,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_DATABASE: process.env.DB_DATABASE,
		DB_PORT: process.env.DB_PORT,
		SIAKAD_URL: process.env.SIAKAD_URL,
		SLC_URL: process.env.SLC_URL,
		LMS_URL: process.env.LMS_URL,
		ADMIN_NIMS: process.env.ADMIN_NIMS,
		BLACKLISTED_COURSES: process.env.BLACKLISTED_COURSES,
		MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
		MINIO_PORT: process.env.MINIO_PORT,
		MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
		MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
		MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
		SENTRY_DSN: process.env.SENTRY_DSN,
		LOGTAIL_TOKEN: process.env.LOGTAIL_TOKEN,
		CALENDAR_ID: process.env.CALENDAR_ID,
	},
});
