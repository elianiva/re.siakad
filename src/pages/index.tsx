import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerAuthSession } from "~/server/auth";

export default function IndexPage() {
	return null;
}
export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
	const session = await getServerAuthSession({ req, res });
	if (session !== null) {
		return {
			redirect: {
				permanent: false,
				destination: "/app",
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
