import { TRPCError } from "@trpc/server";

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
			},
		});
		return courses;
	}),
});
