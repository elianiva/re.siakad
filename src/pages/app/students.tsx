import { useMemo, useState } from "react";
import { SearchBar } from "~/components/form/search-bar";
import { BaseLayout } from "~/components/layouts/base-layout";
import { useAllStudents } from "~/features/student";
import { StudentCard } from "~/features/student/components/card/student-card";

const StudentsPage: NextPageWithLayout = () => {
	const { data: students = [], isLoading } = useAllStudents();
	const [keyword, setKeyword] = useState("");
	const filteredStudents = useMemo(
		() =>
			students.filter((docent) => {
				if (keyword.length < 1) return true;
				const keywordRE = new RegExp(keyword, "gi");
				return keywordRE.test(docent.name);
			}),
		[students, keyword]
	);

	function handleSearch(keyword: string) {
		setKeyword(keyword);
	}

	return (
		<div className="h-full w-full p-10">
			<h1 className="mb-8 text-center text-4xl font-bold">List of Students</h1>
			<SearchBar onChange={handleSearch} />
			<div className="mt-8 flex flex-col gap-4">
				{isLoading ? (
					<>
						<div className="h-20 w-full animate-pulse rounded-xl bg-neutral-300" />
						<div className="h-20 w-full animate-pulse rounded-xl bg-neutral-300" />
						<div className="h-20 w-full animate-pulse rounded-xl bg-neutral-300" />
					</>
				) : (
					filteredStudents.map((student) => (
						<StudentCard key={student.name} nim={student.nim} name={student.name} photo={student.photo} />
					))
				)}
			</div>
		</div>
	);
};

StudentsPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default StudentsPage;
