import { Logtail } from "@logtail/node";
import { env } from "~/env.mjs";

const isProduction = env.NODE_ENV === "production";
const logger = isProduction ? new Logtail(env.LOGTAIL_TOKEN) : console;

const PREFIX = {
	debug: "[DEBUG] >",
	info: "[INFO] >",
	error: "[ERROR] >",
	warn: "[WARN] >",
};

function getTimestamp() {
	if (isProduction) return "";
	return new Date().toLocaleString();
}

export function debug(text: string) {
	void logger.info(`${getTimestamp()} ${PREFIX.debug} ${text}`);
}

export function info(text: string) {
	void logger.info(`${getTimestamp()} ${PREFIX.info} ${text}`);
}

export function error(text: string) {
	void logger.error(`${getTimestamp()} ${PREFIX.error} ${text}`);
}

export function warn(text: string) {
	void logger.warn(`${getTimestamp()} ${PREFIX.warn} ${text}`);
}
