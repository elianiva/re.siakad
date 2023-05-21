import { z } from "zod";

export const loginRequest = z.object({
	nim: z.string().refine((str) => /[0-9]{10}/.test(str), "Invalid NIM format! (ex: 2241720000)"),
	password: z.string().min(1, "Password can't be empty!"),
});
export type LoginRequest = z.infer<typeof loginRequest>;

export const reAuthRequest = loginRequest.omit({ nim: true });
export type ReAuthRequest = z.infer<typeof reAuthRequest>;

export const lmsReAuthRequest = reAuthRequest.extend({
	courseUrl: z.string().url(),
});
export type LmsReAuthRequest = z.infer<typeof lmsReAuthRequest>;
