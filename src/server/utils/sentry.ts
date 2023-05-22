import * as sentry from "@sentry/node";
import { env } from "~/env.mjs";

sentry.init({
	dsn: env.SENTRY_DSN,
	enabled: env.NODE_ENV === "production",
	environment: env.NODE_ENV,
	tracesSampleRate: 1.0,
});

export { sentry };
