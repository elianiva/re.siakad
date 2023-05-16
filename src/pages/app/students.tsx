import { BaseLayout } from "~/components/layouts/base-layout";

const StudentsPage: NextPageWithLayout = () => {
	return <h1 className="text-8xl font-bold text-neutral-900">Students</h1>;
};

StudentsPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default StudentsPage;
