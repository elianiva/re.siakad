import { api } from "~/utils/api";

export function useCourseCount(type: "lecture" | "meeting" | "course") {
	return api.course.count.useQuery({ type });
}
