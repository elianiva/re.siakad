import { api } from "~/utils/api";

export function useProfile() {
	const { data } = api.student.profile.useQuery();
	return data;
}
