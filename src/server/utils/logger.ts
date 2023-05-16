const debugPrefix = "[DEBUG] >";
const infoPrefix = "[INFO] >";
const errorPrefix = "[ERROR] >";
const warnPrefix = "[WARN] >";

function getTimestamp() {
	return new Date().toLocaleString();
}

export function debug(text: string) {
	console.info(`${getTimestamp()} ${debugPrefix} ${text}`);
}

export function info(text: string) {
	console.info(`${getTimestamp()} ${infoPrefix} ${text}`);
}

export function error(text: string) {
	console.error(`${getTimestamp()} ${errorPrefix} ${text}`);
}

export function warn(text: string) {
	console.warn(`${getTimestamp()} ${warnPrefix} ${text}`);
}
