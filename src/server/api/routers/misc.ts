import { TRPCError } from "@trpc/server";
import { lmsReAuthRequest, reAuthRequest } from "~/features/auth";
import { refreshContent } from "~/server/refresh-content";
import * as siakadClient from "~/server/siakad-client";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const miscRouter = createTRPCRouter({
	refreshData: protectedProcedure.input(reAuthRequest).mutation(async ({ input, ctx }) => {
		const nim = ctx.session.user.nim;
		if (nim === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "NIM is required" });

		const result = await refreshContent({ credentials: { nim, password: input.password } });
		if (result.status === 400) throw new TRPCError({ code: "BAD_REQUEST", message: result.message });
		if (result.status === 403) throw new TRPCError({ code: "FORBIDDEN", message: result.message });
		if (result.status === 404) throw new TRPCError({ code: "NOT_FOUND", message: result.message });
		if (result.status === 500) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.message });

		return result;
	}),
	refreshSession: protectedProcedure.input(lmsReAuthRequest).mutation(async ({ input, ctx }) => {
		const nim = ctx.session.user.nim;
		if (nim === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "NIM is required" });

		const cookie = await siakadClient.collectCookies({
			credentials: { nim, password: input.password },
			courseUrl: input.courseUrl,
		});
		await ctx.prisma.student.update({
			where: { nim },
			data: { cookie },
		});
	}),
});
