import { BaseLayout } from "~/components/layouts/base-layout";

const AppHomePage: NextPageWithLayout = () => {
	return <h1 className="text-8xl font-bold text-neutral-900">Home</h1>;
};

AppHomePage.getLayout = (children) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default AppHomePage;
