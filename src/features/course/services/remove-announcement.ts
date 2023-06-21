import { api } from "~/utils/api";

export function useRemoveAnnouncement() {
	const utils = api.useContext();
	return api.course.removeAnnouncement.useMutation({
		async onSuccess() {
			await utils.course.announcements.invalidate();
		},
	});
}
