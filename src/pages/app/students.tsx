import { useMemo, useState } from "react";
import { SearchBar } from "~/components/form/search-bar";
import { BaseLayout } from "~/components/layouts/base-layout";
import { DocentCard } from "~/features/docent";
import { useAllStudents } from "~/features/student";

const StudentsPage: NextPageWithLayout = () => {
	const { data: students = [] } = useAllStudents();
	const [keyword, setKeyword] = useState("");
	const filteredStudents = useMemo(
		() =>
			students.filter((docent) => {
				console.log({ keyword });
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
			<h1 className="mb-8 text-center text-4xl font-bold">List of Docents</h1>
			<SearchBar onChange={handleSearch} />
			<div className="mt-8 flex flex-col gap-4">
				{filteredStudents.map((student) => (
					<DocentCard
						key={student.name}
						name={student.name}
						photo={student.photo}
						email={""}
						nidn={""}
						phone={""}
						courses={[]}
					/>
				))}
			</div>
		</div>
	);
};

StudentsPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default StudentsPage;
