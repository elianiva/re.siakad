import { verify } from "argon2";
import { type NextApiRequest, type NextApiResponse } from "next";
import { loginRequest } from "~/features/auth";
import { prisma } from "~/server/db";
import * as siakadClient from "~/server/siakad-client";
import * as contentScraper from "~/server/content-scraper";
import * as logger from "~/server/utils/logger";
import { wrapResult } from "~/utils/result";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const input = loginRequest.safeParse(req.body);
	if (!input.success) {
		res.status(400).json(input.error);
		return;
	}

	const user = await prisma.student.findFirst({
		where: {
			nim: input.data.nim,
		},
		select: {
			password: true,
		},
	});
	if (user === null) {
		res.status(404).json({
			message: "User was not found",
		});
		return;
	}

	const isPasswordCorrect = await verify(user.password, input.data.password);
	if (!isPasswordCorrect) {
		res.status(403).json({
			message: "Invalid credential!",
		});
		return;
	}

	const [, cookiesError] = await wrapResult(
		siakadClient.collectCookies({
			credentials: { nim: input.data.nim, password: input.data.password },
		})
	);
	if (cookiesError !== null) {
		logger.info(cookiesError.message);
		res.status(500).json({
			message: "Failed to collect cookies.",
		});
		return;
	}

	const [coursesContent, courseError] = await wrapResult(siakadClient.fetchCoursesContent());
	if (courseError !== null) {
		logger.info(courseError.message);
		res.status(500).json({
			message: "Failed to fetch courses content.",
		});
		return;
	}

	const [scrapedCourses, scrapeError] = await wrapResult(contentScraper.collectCourses(coursesContent));
	if (scrapeError !== null) {
		logger.info(scrapeError.message);
		res.status(500).json({
			message: "Failed to collect courses.",
		});
		return;
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
				docent: {
					connectOrCreate: {
						where: { name: course.docent.name },
						create: {
							email: course.docent.email,
							name: course.docent.name,
							photo: course.docent.photo,
							nidn: "",
							phone: "",
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

	res.status(200).json({
		message: "Successfully refreshed!",
		courses: scrapedCourses,
	});
}
