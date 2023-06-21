import { type FetchOptions, ofetch } from "ofetch";
import { env } from "~/env.mjs";
import { wrapResult } from "~/utils/wrap-result";
import { CookieJar } from "./utils/cookie-jar";
import * as logger from "./utils/logger";
import * as contentScraper from "./content-scraper";
import { minioClient } from "./minio";
import { SiakadFetchError } from "./error/siakad-fetch";
import { InvalidResponseError } from "./error/invalid";

const cookieJar = new CookieJar();
let hasMoodleSession = false;

function collectSiakadCookies() {
	return fetchWithCookies(env.SIAKAD_URL, { method: "HEAD" });
}

function collectHomepageCookies() {
	return fetchWithCookies(`${env.SIAKAD_URL}/beranda`, { method: "HEAD" });
}

function collectSlcCookies() {
	return fetchWithCookies(env.SLC_URL, { method: "HEAD" });
}

async function collectMoodleCookies(courseUrl: string) {
	// the first firstResponse, which has a url format of `slcUrl/spada/?gotourl=xxx` is used to get the cookie needed for the lms page itself
	// the firstResponse is a <script>window.location="<lmsUrl>"</script>, which we do in the second request
	// not sure why they use client side redirect instead of responding with 302 status code
	await fetchWithCookies(`${env.SLC_URL}/spada?gotourl=${encodeURIComponent(courseUrl)}`);

	// keep fetching until we get the cookie
	while (!hasMoodleSession) {
		const headers = new Headers();
		headers.set("Sec-Fetch-Site", "same-site");
		headers.set("Referer", env.SLC_URL);
		await fetchWithCookies(courseUrl, { headers });

		// we can't simply do `hasMoodleSession = true` after fetching
		// because we can't be sure if it's succeeded or not
		if (cookieJar.has("MoodleSession")) {
			hasMoodleSession = true;
		}
	}

	return cookieJar.get("MoodleSession")!.value;
}

function postForm<TResponse>(url: RequestInfo, options: FetchOptions = {}) {
	const headers = new Headers();
	headers.set("Accept", "application/json");
	headers.set("Referer", `${env.SIAKAD_URL}/login/index/err/6`);
	headers.set("X-Requested-With", "XMLHttpRequest");
	return fetchWithCookies<TResponse>(url, {
		...options,
		method: "POST",
		headers,
	});
}

async function fetchWithCookies<TResponse>(url: RequestInfo, options: FetchOptions = {}) {
	const headers = new Headers();
	headers.set("Cookie", cookieJar.serialised());

	// merge headers if it's provided from the option
	if (options.headers !== undefined) {
		for (const [key, value] of (options.headers as unknown as Map<string, string>).entries()) {
			headers.set(key, value);
		}
	}

	return ofetch(url, {
		...options,
		retry: 0,
		headers,
		onResponse: ({ response }) => {
			const cookies = response.headers.get("set-cookie");
			if (cookies === null) return;
			cookieJar.store(cookies);
		},
	}) as Promise<TResponse>;
}

type StudentData = {
	photo: string;
	nim: string;
	name: string;
};
export async function collectStudentData(): Promise<StudentData> {
	const page = await fetchWithCookies<string>(`${env.SIAKAD_URL}/beranda`, { parseResponse: (text) => text });
	return contentScraper.collectStudentAnnouncement(page);
}

type LoginOptions = {
	nim: string;
	password: string;
	fresh?: boolean;
};
export async function login(opts: LoginOptions): Promise<boolean> {
	if (opts.fresh) {
		logger.info("Collecting siakad cookies...");
		await collectSiakadCookies();
	}

	const formData = new FormData();
	formData.set("username", opts.nim);
	formData.set("password", opts.password);

	logger.info("Logging in...");
	const response = await postForm<{ output: string }>(`${env.SIAKAD_URL}/login`, {
		body: formData,
		parseResponse: JSON.parse,
	});

	// NOTE(elianiva): not ideal, but it is what it is
	return response.output === "ok";
}

type RemoteFileResponse = {
	fileName: string;
	file: Blob;
};
async function fetchRemoteFile(id: string, cookie: string): Promise<RemoteFileResponse> {
	let moodleSession = cookieJar.get("MoodleSession")?.value;
	if (moodleSession === undefined) {
		moodleSession = await collectMoodleCookies(`${env.LMS_URL}/course/view.php?id=${id}`);
	}

	const headers = new Headers();
	headers.set("Cookie", `${cookie}; MoodleSession=${moodleSession}`);

	const [response, fetchError] = await wrapResult(
		ofetch.native(`${env.LMS_URL}/mod/resource/view.php?id=${id}`, { headers, redirect: "follow" })
	);
	if (fetchError !== null || response === null) throw new SiakadFetchError();

	// we need the filename part
	// example -> 'Content-Disposition: inline; filename="Jobsheet 2 - Objek.pdf"'
	// into    -> 'Jobsheet 2 - Object.pdf'
	const fileName = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1];

	const [file, blobError] = await wrapResult(response.blob());
	if (blobError !== null) throw new InvalidResponseError();

	return { file, fileName: fileName ?? "unknown_file_name" };
}

async function storeRemoteFile(name: string, file: Blob) {
	const arrayBuffer = await file.arrayBuffer();
	await minioClient.putObject(env.MINIO_BUCKET_NAME, name, Buffer.from(arrayBuffer));
	return fetchLocalFileUrl(name);
}

async function fetchLocalFileUrl(name: string): Promise<string> {
	const [files, listError] = await wrapResult<string[]>(
		new Promise((resolve, reject) => {
			const files: string[] = [];
			const stream = minioClient.listObjectsV2(env.MINIO_BUCKET_NAME, name);
			stream.on("data", (object) => files.push(object.name));
			stream.on("close", () => resolve(files));
			stream.on("error", () => reject(new Error("Failed to list files")));
		})
	);
	if (listError !== null || files.length < 1) throw new Error("Object doesn't exist");
	return minioClient.presignedGetObject(env.MINIO_BUCKET_NAME, files[0]!);
}

export async function fetchFile(id: string, cookie: string): Promise<string> {
	const [presignedUrl, localFileError] = await wrapResult(fetchLocalFileUrl(id));
	if (localFileError !== null) {
		const [remoteFile, remoteFileError] = await wrapResult(fetchRemoteFile(id, cookie));
		if (remoteFileError !== null) throw remoteFileError;
		return storeRemoteFile(id + "_" + remoteFile.fileName, remoteFile.file);
	}
	return presignedUrl;
}

type CollectCookiesOptions = ({ credentials: LoginOptions; immediate?: false } | { immediate: true }) & {
	courseUrl?: string;
};
export async function collectCookies(opts: CollectCookiesOptions) {
	if (opts.immediate) return cookieJar.serialised();

	logger.info("Collecting siakad cookies");
	const [, siakadError] = await wrapResult(collectSiakadCookies());
	if (siakadError !== null) {
		logger.error("failed to collect siakad cookies");
		throw siakadError;
	}
	logger.info("siakad cookies has been collected");

	logger.info("attempting login");
	const [, loginError] = await wrapResult(login({ ...opts.credentials, fresh: false }));
	if (loginError !== null) {
		logger.error("failed to login");
		throw loginError;
	}
	logger.info("successfully logged in");

	logger.info("collecting siakad homepage cookies");
	const [, homepageError] = await wrapResult(collectHomepageCookies());
	if (homepageError !== null) {
		logger.error("failed to collect siakad homepage cookie");
		throw homepageError;
	}
	logger.info("siakad homepage cookie has been collected");

	logger.info("collecting slc cookies");
	const [, slcError] = await wrapResult(collectSlcCookies());
	if (slcError !== null) {
		logger.error("failed to collect slc cookie");
		throw slcError;
	}
	logger.info("slc cookie has been collected");

	if (opts.courseUrl !== undefined) {
		logger.info("collecting lms cookies");
		const [, lmsError] = await wrapResult(fetchLmsContent(opts.courseUrl));
		if (lmsError !== null) {
			logger.error("failed to collect lms cookie");
			throw lmsError;
		}
		logger.info("lms cookie has been collected");
	}

	return cookieJar.serialised();
}

export function fetchCoursesList(): Promise<string> {
	return fetchWithCookies(`${env.SLC_URL}/spada`, { parseResponse: (text) => text });
}

export async function fetchLmsContent(courseUrl: string): Promise<string> {
	await collectMoodleCookies(courseUrl);
	return fetchWithCookies(courseUrl, { parseResponse: (text) => text });
}
