import { api } from "~/utils/api";

export function useAllAnnouncements() {
	return api.course.announcements.useQuery();
}
