import { api } from "~/utils/api";

export function useAllCourses() {
	return api.course.getAll.useQuery();
}
