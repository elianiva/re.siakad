import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const docentRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const docents = await ctx.prisma.docent.findMany({
			select: {
				name: true,
				email: true,
				nidn: true,
				phone: true,
				photo: true,
				courses: {
					select: {
						title: true,
					},
				},
			},
		});
		return docents;
	}),
});
