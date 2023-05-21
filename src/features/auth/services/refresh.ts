import { api } from "~/utils/api";

// NOTE(elianiva): doesn't really belong in features/auth but I'm not sure where else to put it
export function useRefreshSiakadData() {
	const utils = api.useContext();
	return api.misc.refreshData.useMutation({
		async onSuccess() {
			await utils.invalidate();
		},
	});
}

export function useRefreshSession() {
	return api.misc.refreshSession.useMutation();
}
