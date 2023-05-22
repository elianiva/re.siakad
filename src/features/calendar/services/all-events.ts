import { api } from "~/utils/api";

export function useAllCalendarEvents() {
	return api.calendar.events.useQuery();
}
