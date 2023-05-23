import { useMemo, useState } from "react";
import { SearchBar } from "~/components/form/search-bar";
import { BaseLayout } from "~/components/layouts/base-layout";
import { useAllCourses, CourseCard } from "~/features/course";

const SEARCH_CRITERIA = ["course", "meeting", "lecture"] as const;
type SearchCriteria = (typeof SEARCH_CRITERIA)[number];

const CoursesPage: NextPageWithLayout = () => {
	const { data: courses = [], isLoading } = useAllCourses();
	const [selectedCriteria, setSelectedCriteria] = useState<SearchCriteria[]>([]);
	const [keyword, setKeyword] = useState("");
	const filteredCourses = useMemo(() => {
		const keywordRE = new RegExp(keyword, "gi");
		return courses
			.map((course) => ({
				...course,
				meetings: course.meetings
					.map((meeting) => ({
						...meeting,
						lectures: meeting.lectures.filter((lecture) =>
							selectedCriteria.includes("lecture") ? keywordRE.test(lecture.name) : true
						),
					}))
					.filter((meeting) => (selectedCriteria.includes("meeting") ? keywordRE.test(meeting.title) : true)),
			}))
			.filter((course) => course.meetings.length > 0)
			.filter((course) => (selectedCriteria.includes("course") ? keywordRE.test(course.title) : true));
	}, [courses, keyword, selectedCriteria]);

	function handleSearch(keyword: string) {
		setKeyword(keyword);
	}

	return (
		<div className="h-full w-full p-10">
			<h1 className="mb-8 text-center text-4xl font-bold">List of Courses</h1>
			<SearchBar onChange={handleSearch} />
			<div className="flex gap-3 py-4">
				{SEARCH_CRITERIA.map((criteria) => (
					<div
						key={criteria}
						className={`${
							selectedCriteria.includes(criteria)
								? "border-orange-500 text-orange-700"
								: "border-neutral-300 text-neutral-700"
						} cursor-pointer rounded-md border bg-white px-3 py-1 capitalize`}
						onClick={() => {
							if (selectedCriteria.includes(criteria)) {
								setSelectedCriteria((selectedCriteria) =>
									selectedCriteria.filter((selected) => selected !== criteria)
								);
							} else {
								setSelectedCriteria((selectedCriteria) => selectedCriteria.concat([criteria]));
							}
						}}
					>
						{criteria}
					</div>
				))}
			</div>
			<div className="flex flex-col gap-4">
				{isLoading ? (
					<>
						<div className="h-20 w-full animate-pulse rounded-xl bg-neutral-300" />
						<div className="h-20 w-full animate-pulse rounded-xl bg-neutral-300" />
						<div className="h-20 w-full animate-pulse rounded-xl bg-neutral-300" />
					</>
				) : (
					filteredCourses.map((course) => (
						<CourseCard
							key={course.title}
							docent={course.docent.name}
							title={course.title}
							meetings={course.meetings}
						/>
					))
				)}
			</div>
		</div>
	);
};

CoursesPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default CoursesPage;
