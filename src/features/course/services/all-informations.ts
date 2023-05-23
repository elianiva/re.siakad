import { api } from "~/utils/api";

export function useAllInformations() {
	return api.course.informations.useQuery();
}
