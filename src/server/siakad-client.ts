import { FetchOptions, ofetch } from "ofetch";
import { env } from "~/env.mjs";
import { CookieJar } from "./utils/cookie-jar";
import * as logger from "./utils/logger";

export class HttpClient {
	#hasMoodleSession = false;
	#cookieJar = new CookieJar();

	private async collectSiakadCookies() {
		await this.fetch(env.SIAKAD_URL, { method: "HEAD" });
	}

	private async collectHomepageCookies() {
		await this.fetch(`${env.SIAKAD_URL}/beranda`, { method: "HEAD" });
	}

	private async collectSlcCookies() {
		await this.fetch(env.SLC_URL, { method: "HEAD" });
	}

	private async login() {
		const formData = new FormData();
		formData.set("username", env.NIM);
		formData.set("password", env.PASSWORD);

		await this.postForm(`${env.SIAKAD_URL}/login`, {
			body: formData,
		});
	}

	private async postForm(url: RequestInfo, options: FetchOptions = {}) {
		const headers = new Headers();
		headers.set("Accept", "application/json");
		headers.set("Referer", `${env.SIAKAD_URL}/login/index/err/6`);
		headers.set("X-Requested-With", "XMLHttpRequest");
		return this.fetch(url, {
			...options,
			method: "POST",
			headers,
		});
	}

	private async fetch(url: RequestInfo, options: FetchOptions = {}) {
		// serialise the cookie
		let cookieString = this.#cookieJar
			.entries()
			.map((cookie) => `${cookie.key}=${cookie.value}`)
			.join("; ");

		const headers = new Headers();
		headers.set("Cookie", cookieString);

		// merge headers if it's provided from the option
		if (options.headers !== undefined) {
			for (const [key, value] of (options.headers as unknown as Map<string, string>).entries()) {
				headers.set(key, value);
			}
		}

		return ofetch(url, {
			...options,
			headers,
			onResponse: ({ response }) => {
				const cookies = response.headers.get("set-cookie");
				if (cookies === null) return;
				this.#cookieJar.store(response.headers.get("set-cookie") ?? "");
			},
		});
	}

	public async collectCookies() {
		try {
			logger.info("collecting siakad cookies");
			await this.collectSiakadCookies();
			logger.info("siakad cookies has been collected");
		} catch (err) {
			logger.error("failed to collect siakad cookies");
			throw err;
		}

		try {
			logger.info("attempting login");
			await this.login();
			logger.info("successfully logged in");
		} catch (err) {
			logger.error("failed to login");
			throw err;
		}

		try {
			logger.info("collecting siakad homepage cookies");
			await this.collectHomepageCookies();
			logger.info("siakad homepage cookie has been collected");
		} catch (err) {
			logger.error("failed to collect siakad homepage cookie");
			throw err;
		}

		try {
			logger.info("collecting slc cookies");
			await this.collectSlcCookies();
			logger.info("slc cookie has been collected");
		} catch (err) {
			logger.error("failed to collect slc cookie");
			throw err;
		}
	}

	public async fetchSubjectsContent() {
		const response: string = await this.fetch(`${env.SLC_URL}/spada`, { parseResponse: (text) => text });
		return response;
	}

	public async fetchLmsContent(courseUrl: string) {
		// the first firstResponse, which has a url format of `slcUrl/spada/?gotourl=xxx` is used to get the cookie needed for the lms page itself
		// the firstResponse is a <script>window.location="<lmsUrl>"</script>, which we do in the second request
		// not sure why they use client side redirect instead of responding with 302 status code
		await this.fetch(`${env.SLC_URL}/spada?gotourl=${encodeURIComponent(courseUrl)}`);
		if (!this.#hasMoodleSession) {
			const headers = new Headers();
			headers.set("Sec-Fetch-Site", "same-site");
			headers.set("Referer", env.SLC_URL);
			await this.fetch(courseUrl, { headers });

			// we can't simply do `h.hasMoodleSession = true` after fetching
			// because we can't be sure if it's succeeded or not
			if (this.#cookieJar.has("MoodleSession")) {
				this.#hasMoodleSession = true;
			}
		}

		return await this.fetch(courseUrl, { parseResponse: (text) => text });
	}
}
