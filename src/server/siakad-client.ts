import { type FetchOptions, ofetch } from "ofetch";
import * as cheerio from "cheerio";
import { env } from "~/env.mjs";
import { CookieJar } from "./utils/cookie-jar";
import * as logger from "./utils/logger";

const cookieJar = new CookieJar();
let hasMoodleSession = false;

async function collectSiakadCookies() {
	await fetch(env.SIAKAD_URL, { method: "HEAD" });
}

async function collectHomepageCookies() {
	await fetch(`${env.SIAKAD_URL}/beranda`, { method: "HEAD" });
}

type StudentData = {
	photo: string;
	nim: string;
	name: string;
};
export async function collectStudentData(): Promise<StudentData> {
	const page = await fetch<string>(`${env.SIAKAD_URL}/beranda`, { parseResponse: (text) => text });
	const $ = cheerio.load(page);
	const [nim, name] = $(".username")
		.text()
		.split("/")
		.map((text) => text.trim());
	if (nim === undefined || name === undefined) {
		throw new Error("Couldn't get the student's name and NIM.");
	}
	const photo = $(".dropdown-user img[alt='FOTO']").attr("src");
	return { nim, name, photo: photo ?? "" };
}

async function collectSlcCookies() {
	await fetch(env.SLC_URL, { method: "HEAD" });
}

type LoginOptions = {
	nim: string;
	password: string;
};

export async function login(opts: LoginOptions): Promise<boolean> {
	logger.info("Collecting siakad cookies...");
	await collectSiakadCookies();

	const formData = new FormData();
	formData.set("username", opts.nim);
	formData.set("password", opts.password);

	logger.info("Logging in...");
	const response = await postForm<{ output: string }>(`${env.SIAKAD_URL}/login`, {
		body: formData,
		parseResponse: JSON.parse,
	});
	return response.output === "ok";
}

async function postForm<TResponse>(url: RequestInfo, options: FetchOptions = {}) {
	const headers = new Headers();
	headers.set("Accept", "application/json");
	headers.set("Referer", `${env.SIAKAD_URL}/login/index/err/6`);
	headers.set("X-Requested-With", "XMLHttpRequest");
	return fetch<TResponse>(url, {
		...options,
		method: "POST",
		headers,
	});
}

async function fetch<TResponse>(url: RequestInfo, options: FetchOptions = {}) {
	// serialise the cookie
	const cookieString = cookieJar
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
			cookieJar.store(response.headers.get("set-cookie") ?? "");
		},
	}) as Promise<TResponse>;
}

export async function collectCookies(opts: { credentials: LoginOptions }) {
	try {
		logger.info("collecting siakad cookies");
		await collectSiakadCookies();
		logger.info("siakad cookies has been collected");
	} catch (err) {
		logger.error("failed to collect siakad cookies");
		throw err;
	}

	try {
		logger.info("attempting login");
		await login(opts.credentials);
		logger.info("successfully logged in");
	} catch (err) {
		logger.error("failed to login");
		throw err;
	}

	try {
		logger.info("collecting siakad homepage cookies");
		await collectHomepageCookies();
		logger.info("siakad homepage cookie has been collected");
	} catch (err) {
		logger.error("failed to collect siakad homepage cookie");
		throw err;
	}

	try {
		logger.info("collecting slc cookies");
		await collectSlcCookies();
		logger.info("slc cookie has been collected");
	} catch (err) {
		logger.error("failed to collect slc cookie");
		throw err;
	}
}

export async function fetchCoursesList() {
	const response: string = await fetch(`${env.SLC_URL}/spada`, { parseResponse: (text) => text });
	return response;
}

export async function fetchLmsContent(courseUrl: string): Promise<string> {
	// the first firstResponse, which has a url format of `slcUrl/spada/?gotourl=xxx` is used to get the cookie needed for the lms page itself
	// the firstResponse is a <script>window.location="<lmsUrl>"</script>, which we do in the second request
	// not sure why they use client side redirect instead of responding with 302 status code
	await fetch(`${env.SLC_URL}/spada?gotourl=${encodeURIComponent(courseUrl)}`);
	if (!hasMoodleSession) {
		const headers = new Headers();
		headers.set("Sec-Fetch-Site", "same-site");
		headers.set("Referer", env.SLC_URL);
		await fetch(courseUrl, { headers });

		// we can't simply do `h.hasMoodleSession = true` after fetching
		// because we can't be sure if it's succeeded or not
		if (cookieJar.has("MoodleSession")) {
			hasMoodleSession = true;
		}
	}

	return fetch(courseUrl, { parseResponse: (text) => text });
}
