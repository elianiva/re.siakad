import { BaseLayout } from "~/components/layouts/base-layout";

const LecturersPage: NextPageWithLayout = () => {
	return <h1 className="text-8xl font-bold text-neutral-900">Lecturers</h1>;
};

LecturersPage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default LecturersPage;