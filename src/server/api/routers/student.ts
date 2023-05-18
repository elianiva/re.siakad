import { TRPCError } from "@trpc/server";
import { loginRequest } from "~/features/auth";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { refreshContent } from "~/server/refresh-content";

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
				role: true,
			},
		});
		if (userData === null) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

		return userData;
	}),
	refresh: protectedProcedure.input(loginRequest).mutation(async ({ input }) => {
		const result = await refreshContent({ credentials: input });
		if (result.status === 400) throw new TRPCError({ code: "BAD_REQUEST", message: result.message });
		if (result.status === 403) throw new TRPCError({ code: "FORBIDDEN", message: result.message });
		if (result.status === 404) throw new TRPCError({ code: "NOT_FOUND", message: result.message });
		if (result.status === 500) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.message });
		return result;
	}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const students = await ctx.prisma.student.findMany();
		return students;
	}),
});
