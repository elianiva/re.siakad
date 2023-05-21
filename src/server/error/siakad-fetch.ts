export class SiakadFetchError extends Error {
	constructor(message?: string) {
		super(message ?? "Failed to fetch from SIAKAD");
	}
}
