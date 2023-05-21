import { useMemo, useState } from "react";
import { SearchBar } from "~/components/form/search-bar";
import { BaseLayout } from "~/components/layouts/base-layout";
import { DocentCard, useAllDocents } from "~/features/docent";

const DocentsPage: NextPageWithLayout = () => {
	const { data: docents = [] } = useAllDocents();
	const [keyword, setKeyword] = useState("");
	const filteredDocents = useMemo(
		() =>
			docents.filter((docent) => {
				if (keyword.length < 1) return true;
				const keywordRE = new RegExp(keyword, "gi");
				return keywordRE.test(docent.name);
			}),
		[docents, keyword]
	);

	function handleSearch(keyword: string) {
		setKeyword(keyword);
	}

	return (
		<div className="h-full w-full p-10">
			<h1 className="mb-8 text-center text-4xl font-bold">List of Docents</h1>
			<SearchBar onChange={handleSearch} />
			<div className="mt-8 flex flex-col gap-4">
				{filteredDocents.map((docent) => (
					<DocentCard
						key={docent.name}
						name={docent.name}
						email={docent.email}
						nidn={docent.nidn}
						phone={docent.phone ?? "081234567890"}
						photo={docent.photo ?? ""}
						courses={docent.courses}
					/>
				))}
			</div>
		</div>
	);
};

DocentsPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default DocentsPage;
