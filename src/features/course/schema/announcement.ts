import { z } from "zod";

export const sendAnnouncementschema = z.object({
	message: z.string().min(1).max(1024),
});
export type SendAnnouncementschema = z.infer<typeof sendAnnouncementschema>;
