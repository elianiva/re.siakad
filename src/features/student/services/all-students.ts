import { api } from "~/utils/api";

export function useAllStudents() {
	return api.student.getAll.useQuery();
}
