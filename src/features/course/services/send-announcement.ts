import { api } from "~/utils/api";

export function useSendAnnouncement() {
	const utils = api.useContext();
	return api.course.sendAnnouncement.useMutation({
		async onSuccess() {
			await utils.course.announcements.invalidate();
		},
	});
}
