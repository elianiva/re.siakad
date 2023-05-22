import * as cheerio from "cheerio";
import * as siakadClient from "./siakad-client";
import * as logger from "~/server/utils/logger";
import { type Docent, type Lecture, LectureType, type Meeting } from "@prisma/client";
import { env } from "~/env.mjs";
import { ScrapeError } from "./error/scrape-error";

const SELECTOR = {
	subjectCard: ".gallery_grid_item.md-card-content > a",
	subjectName: ".page-header-headings",
	topicItem: ".topics > li .content",
	sectionTitle: ".sectionname",
	meetingDetail: ".summary tbody tbody tr td:last-child",
	lectureList: "ul.section > li",
	activityInstance: ".activityinstance a",
	instanceName: ".instancename",
	modtypeResource: "modtype_resource",
	modtypeAssignment: "modtype_assign",
	modtypeQuiz: "modtype_quiz",
	modtypeUrl: "modtype_url",
	modtypeForum: "modtype_forum",
	modtypePage: "modtype_page",
	docentInfo: ".summary td[valign='top']",
	studentInformation: ".username",
	studentPhoto: ".dropdown-user img[alt='FOTO']",
} as const;

type SimpleLecture = Pick<Lecture, "name" | "url" | "type">;

function extractLecture(node: cheerio.Cheerio<cheerio.Element>): SimpleLecture | undefined {
	const activityInstance = node.find(SELECTOR.activityInstance);
	const classAttribute = node.attr("class");
	if (classAttribute === undefined) return undefined;

	const name = activityInstance.find(SELECTOR.instanceName).text();
	const url = activityInstance.attr("href");
	if (url === undefined) return undefined;

	let lectureType: LectureType = LectureType.unknown;
	switch (true) {
		case classAttribute.includes(SELECTOR.modtypeResource):
			lectureType = LectureType.resource;
			break;
		case classAttribute.includes(SELECTOR.modtypeAssignment):
			lectureType = LectureType.assignment;
			break;
		case classAttribute.includes(SELECTOR.modtypeQuiz):
			lectureType = LectureType.quiz;
			break;
		case classAttribute.includes(SELECTOR.modtypeUrl):
			lectureType = LectureType.url;
			break;
		case classAttribute.includes(SELECTOR.modtypeForum):
			lectureType = LectureType.forum;
			break;
		case classAttribute.includes(SELECTOR.modtypePage):
			lectureType = LectureType.page;
			break;
	}

	return { name, url, type: lectureType };
}

type MeetingWithLectures = Pick<Meeting, "title" | "topic" | "competence"> & { lectures: SimpleLecture[] };

function extractMeeting(element: cheerio.Cheerio<cheerio.Element>): MeetingWithLectures {
	const $ = cheerio.load("");
	const title = element.find(SELECTOR.sectionTitle).text();
	const [topic = "-", competence = "-"] = element
		.find(SELECTOR.meetingDetail)
		.map((_, node) => $.html(node.children));
	const $lectures = element.find(SELECTOR.lectureList) ?? [];
	const lectures = $lectures
		.map((_, el) => {
			const htmlText = element.html();
			if (htmlText === null) return undefined;
			const $ = cheerio.load(htmlText, null, false);
			const node = $(el);
			return extractLecture(node);
		})
		.get()
		.filter((lecture) => lecture !== undefined);

	return { title, lectures, topic, competence };
}

function extractDocents(html: string): Pick<Docent, "email" | "name" | "photo"> {
	const $ = cheerio.load(html);
	const [name = "Unknown", email = "-"] = $(SELECTOR.docentInfo).text().replace("Nama : ", "").split(".Email: ");
	const nonEmptyName = name.length > 0 ? name : "Unknown";
	const nonEmptyEmail = email.length > 0 ? email : "unknown@polinema";

	let photo =
		$(`${SELECTOR.docentInfo} img`).attr("src") ??
		`https://ui-avatars.com/api/?name=${nonEmptyName.replaceAll(" ", "+")}`;

	// conditionally append the protocol to handle the docent image source correctly
	if (!photo.startsWith("https://")) {
		photo = "https:" + photo;
	}

	return { name: nonEmptyName, photo, email: nonEmptyEmail };
}

function collectMeetings(rawMeetings: string): { courseName: string; meetings: MeetingWithLectures[] } {
	const $ = cheerio.load(rawMeetings);
	const courseName = $(SELECTOR.subjectName).text();
	// skip one because the first topicEl is just the detail of the course
	return {
		courseName,
		meetings: $(SELECTOR.topicItem)
			.slice(1)
			.map((_, el) => {
				const node = $(el);
				const meeting = extractMeeting(node);
				return meeting;
			})
			.get(),
	};
}

export function collectCourseLinks(html: string): string[] {
	const $ = cheerio.load(html);
	return $(SELECTOR.subjectCard)
		.map((_, el) => $(el).attr("href"))
		.get()
		.filter((url) => url !== undefined);
}

export async function collectCourses(rawCourses: string) {
	const links = collectCourseLinks(rawCourses).sort();
	const courses = await Promise.all(
		links.map(async (link) => {
			const url = new URL(link);
			const id = url.searchParams.get("id");
			if (id === null) return undefined;
			if (env.BLACKLISTED_COURSES.includes(id)) return undefined;

			logger.info(`collecting content for ${id}`);
			const lmsContent = await siakadClient.fetchLmsContent(link);
			const { courseName: courseName, meetings } = collectMeetings(lmsContent);
			const docent = extractDocents(lmsContent);
			logger.info(`done with ${id}`);

			return { title: courseName, docent, courseNumber: id, meetings };
		})
	);
	return courses.filter((course) => course !== undefined);
}

type StudentData = {
	photo: string;
	nim: string;
	name: string;
};
export function collectStudentInformation(html: string): StudentData {
	const $ = cheerio.load(html);
	const [nim, name] = $(SELECTOR.studentInformation)
		.text()
		.split("/")
		.map((text) => text.trim());
	if (nim === undefined || name === undefined) throw new ScrapeError("Couldn't get the student's name and NIM.");
	const photo = $(SELECTOR.studentPhoto).attr("src") ?? "";
	return { nim, name, photo };
}
