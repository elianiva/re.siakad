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
});
