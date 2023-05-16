import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerAuthSession } from "~/server/auth";

export default function IndexPage() {
	return null;
}
export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
	const session = await getServerAuthSession({ req, res });
	if (session !== null) {
		return {
			redirect: {
				permanent: false,
				destination: "/app/home",
			},
		};
	}

	return {
		redirect: {
			permanent: false,
			destination: "/sign-in",
		},
	};
}
