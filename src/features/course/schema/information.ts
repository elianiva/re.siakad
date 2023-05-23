import { z } from "zod";

export const sendInformationSchema = z.object({
	message: z.string().min(1).max(1024),
});
export type SendInformationSchema = z.infer<typeof sendInformationSchema>;
