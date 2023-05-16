import { Card } from "~/components/card/card";
import { SearchBar } from "~/components/form/search-bar";
import { BaseLayout } from "~/components/layouts/base-layout";
import { useCourses } from "~/features/course/services/useCourses";

const CoursesPage: NextPageWithLayout = () => {
	const { data: courses = [] } = useCourses();

	function handleSearch(keyword: string) {
		console.log({ keyword });
	}

	return (
		<div className="h-full w-full p-10">
			<h1 className="mb-8 text-center text-4xl font-bold">List of Courses</h1>
			<SearchBar onSubmit={handleSearch} />
			<div className="flex flex-col gap-4">
				{[...courses, ...courses].map((course) => (
					<Card key={course.title} subtitle={course.docent.name} {...course} />
				))}
			</div>
		</div>
	);
};

CoursesPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default CoursesPage;
