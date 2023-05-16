import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
	const getLayout = Component.getLayout || ((page) => page);
	return (
		<SessionProvider session={session as Session}>
			<Toaster />
			{getLayout(<Component {...pageProps} />)}
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
