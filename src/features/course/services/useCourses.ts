import { api } from "~/utils/api";

export function useCourses() {
	return api.course.getAll.useQuery();
}
