import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

declare global {
	export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
		getLayout?: (page: ReactElement) => ReactNode;
	};

	export type AppPropsWithLayout = AppProps & {
		Component: NextPageWithLayout;
	};
}
