import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { BaseLayout } from "~/components/layouts/base-layout";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<Toaster />
			<BaseLayout>
				<Component {...pageProps} />
			</BaseLayout>
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
