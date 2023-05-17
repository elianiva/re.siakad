import { api } from "~/utils/api";

export function useAllDocents() {
	return api.docent.getAll.useQuery();
}
