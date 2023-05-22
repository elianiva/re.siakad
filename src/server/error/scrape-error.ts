export class ScrapeError extends Error {
	constructor(message?: string) {
		super(message ?? "Error when scraping the content of the page");
	}
}
