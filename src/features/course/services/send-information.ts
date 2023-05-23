import { api } from "~/utils/api";

export function useSendInformation() {
	const utils = api.useContext();
	return api.course.sendInformation.useMutation({
		async onSuccess() {
			await utils.course.informations.invalidate();
		},
	});
}
