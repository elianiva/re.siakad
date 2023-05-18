import { verify } from "argon2";
import { loginRequest } from "~/features/auth";
import { wrapResult } from "~/utils/result";
import { prisma } from "./db";
import * as logger from "./utils/logger";
import * as siakadClient from "./siakad-client";
import * as contentScraper from "./content-scraper";

type RefreshContentOption = {
	credentials: unknown;
};

export type RefreshContentResult = {
	status: number;
	error?: Error;
	message: string;
};

export async function refreshContent(options: RefreshContentOption): Promise<RefreshContentResult> {
	const input = loginRequest.safeParse(options.credentials);
	if (!input.success) {
		return {
			status: 400,
			error: input.error,
			message: "Failed to parse the input",
		};
	}

	const user = await prisma.student.findFirst({
		where: { nim: input.data.nim },
		select: { password: true },
	});
	if (user === null) {
		return {
			status: 404,
			message: "User was not found",
		};
	}

	const isPasswordCorrect = await verify(user.password, input.data.password);
	if (!isPasswordCorrect) {
		return {
			status: 403,
			message: "Invalid credential",
		};
	}

	const [, cookiesError] = await wrapResult(
		siakadClient.collectCookies({
			credentials: { nim: input.data.nim, password: input.data.password },
		})
	);
	if (cookiesError !== null) {
		logger.info(cookiesError.message);
		return {
			status: 500,
			error: cookiesError,
			message: "Failed to collect cookies",
		};
	}

	const [coursesContent, courseError] = await wrapResult(siakadClient.fetchCoursesList());
	if (courseError !== null) {
		logger.info(courseError.message);
		return {
			status: 500,
			error: courseError,
			message: "Failed to fetch courses list",
		};
	}

	const [scrapedCourses, scrapeError] = await wrapResult(contentScraper.collectCourses(coursesContent));
	if (scrapeError !== null) {
		logger.info(scrapeError.message);
		return {
			status: 500,
			error: scrapeError,
			message: "Failed to collect courses",
		};
	}

	const courses = scrapedCourses.filter((course) => course !== undefined);

	// insert courses
	// can't do batch insert unfortunately since it needs the `connect` property
	for (const course of courses) {
		if (course === undefined) continue;
		await prisma.course.upsert({
			where: { title: course.title },
			create: {
				title: course.title,
				courseNumber: course.courseNumber,
				docent: {
					connectOrCreate: {
						where: { name: course.docent.name },
						create: {
							email: course.docent.email,
							name: course.docent.name,
							photo: course.docent.photo,
							nidn: "0000000000",
							phone: "081234567890",
						},
					},
				},
			},
			update: {},
		});
		logger.info(`Inserted ${course.title}`);
	}

	// insert lectures and meetings
	// can't do batch here either
	for (const course of courses) {
		if (course === undefined) continue;
		for (const meeting of course.meetings) {
			await prisma.meeting.upsert({
				where: {
					courseTitle_title: {
						courseTitle: course.title,
						title: meeting.title,
					},
				},
				update: {},
				create: {
					title: meeting.title,
					courseTitle: course.title,
					competence: meeting.competence,
					topic: meeting.topic,
					course: {
						connect: {
							title: course.title,
						},
					},
					lectures: {
						connectOrCreate: meeting.lectures.map((lecture) => ({
							create: {
								deadline: new Date(),
								name: lecture.name,
								url: lecture.url,
								type: lecture.type,
							},
							where: {
								url: lecture.url,
							},
						})),
					},
				},
			});
			logger.info(`Inserted ${meeting.title}`);
		}
	}

	return {
		status: 200,
		message: "Successfully refreshed siakad data",
	};
}
