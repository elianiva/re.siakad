import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const studentRouter = createTRPCRouter({
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
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const students = await ctx.prisma.student.findMany();
		return students;
	}),
});
