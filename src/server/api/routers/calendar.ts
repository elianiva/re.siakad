import { addDays, subDays } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { google } from "googleapis";
import { env } from "~/env.mjs";
import secrets from "~/secrets/google-api-secrets.json";

const jwtClient = new google.auth.JWT(
	secrets.client_email,
	undefined,
	secrets.private_key,
	["https://www.googleapis.com/auth/calendar"],
	secrets.client_email
);
const calendar = google.calendar("v3");

type Event = {
	id?: string | null;
	title?: string | null;
	start?: string | null;
	end?: string | null;
	allDay: boolean;
};

export const calendarRouter = createTRPCRouter({
	events: protectedProcedure.query(async (): Promise<Event[]> => {
		const events = await calendar.events.list({
			auth: jwtClient,
			calendarId: env.CALENDAR_ID,
			timeMin: subDays(Date.now(), 30).toISOString(),
			timeMax: addDays(Date.now(), 30).toISOString(),
			singleEvents: true,
		});

		return (
			events.data.items?.map((item) => ({
				id: item.id,
				title: item.summary,
				start: item.start?.dateTime || item.start?.date,
				end: item.end?.dateTime || item.end?.date,
				allDay: !item.start?.dateTime,
			})) || []
		);
	}),
});
