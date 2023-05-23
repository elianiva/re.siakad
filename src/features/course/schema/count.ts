import { z } from "zod";

export const countSchema = z.object({
	type: z.enum(["lecture", "meeting", "course"]),
});
export type CountSchema = z.infer<typeof countSchema>;
