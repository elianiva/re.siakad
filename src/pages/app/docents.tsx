import { SearchBar } from "~/components/form/search-bar";
import { BaseLayout } from "~/components/layouts/base-layout";
import { DocentCard, useAllDocents } from "~/features/docent";

const DocentsPage: NextPageWithLayout = () => {
	const { data: docents = [] } = useAllDocents();

	function handleSearch(keyword: string) {
		console.log({ keyword });
	}

	return (
		<div className="h-full w-full p-10">
			<h1 className="mb-8 text-center text-4xl font-bold">List of Courses</h1>
			<SearchBar onSubmit={handleSearch} />
			<div className="flex flex-col gap-4">
				{docents.map((docent) => (
					<DocentCard
						key={docent.name}
						name={docent.name}
						email={docent.email}
						nidn={docent.nidn}
						phone={docent.phone}
						photo={docent.photo}
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
