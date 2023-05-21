export class InvalidResponseError extends Error {
	constructor() {
		super("Invalid response type");
	}
}
