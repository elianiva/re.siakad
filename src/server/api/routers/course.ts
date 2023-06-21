import { TRPCError } from "@trpc/server";
import { countSchema, removeAnnouncementSchema, sendAnnouncementschema } from "~/features/course";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const courses = await ctx.prisma.course.findMany({
			select: {
				title: true,
				docent: {
					select: {
						name: true,
					},
				},
				meetings: {
					select: {
						id: true,
						title: true,
						topic: true,
						competence: true,
						lectures: {
							select: {
								id: true,
								name: true,
								url: true,
								type: true,
							},
						},
					},
				},
			},
		});
		return courses;
	}),
	count: protectedProcedure.input(countSchema).query(async ({ ctx, input }) => {
		if (input.type === "course") return ctx.prisma.course.count();
		if (input.type === "meeting") return ctx.prisma.meeting.count({ where: { lectures: { some: {} } } });
		if (input.type === "lecture") return ctx.prisma.lecture.count();
		return -1;
	}),
	sendAnnouncement: protectedProcedure.input(sendAnnouncementschema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session.user.id;
		if (userId === undefined) throw new TRPCError({ code: "UNAUTHORIZED" });
		await ctx.prisma.announcement.create({
			data: {
				student: { connect: { id: userId } },
				message: input.message,
			},
		});
	}),
	announcements: protectedProcedure.query(async ({ ctx }) => {
		return ctx.prisma.announcement.findMany({
			select: {
				id: true,
				createdAt: true,
				message: true,
				student: { select: { name: true } },
			},
		});
	}),
	removeAnnouncement: protectedProcedure.input(removeAnnouncementSchema).mutation(async ({ input, ctx }) => {
		const userId = ctx.session.user.id;
		if (userId === undefined) throw new TRPCError({ code: "UNAUTHORIZED" });
		await ctx.prisma.announcement.delete({
			where: {
				id: input.id
			},
		});
	})
});
