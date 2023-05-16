import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const studentRouter = createTRPCRouter({
	hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
		return {
			greeting: `Hello ${input.text}`,
		};
	}),
	profile: protectedProcedure.query(async ({ ctx }) => {
		const userData = await ctx.prisma.student.findFirst({
			where: {
				id: ctx.session.user.id,
			},
			select: {
				id: true,
				nim: true,
				name: true,
				photo: true,
			},
		});
		if (userData === null) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

		return userData;
	}),
});
