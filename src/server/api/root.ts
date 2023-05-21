import { createTRPCRouter } from "~/server/api/trpc";
import { studentRouter } from "./routers/student";
import { courseRouter } from "./routers/course";
import { docentRouter } from "./routers/docent";
import { miscRouter } from "./routers/misc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	student: studentRouter,
	course: courseRouter,
	docent: docentRouter,
	misc: miscRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
