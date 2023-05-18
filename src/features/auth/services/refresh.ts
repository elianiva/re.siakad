import { api } from "~/utils/api";

// NOTE(elianiva): doesn't really belong in features/auth but I'm not sure where else to put it
export function useRefreshSiakadData() {
	const utils = api.useContext();
	return api.student.refresh.useMutation({
		async onSuccess() {
			await utils.invalidate();
		},
	});
}
