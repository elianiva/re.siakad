import Image from "next/image";
import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../sidebar/sidebar";
import Head from "next/head";

type BaseLayoutProps = PropsWithChildren<{
	plain?: boolean;
}>;

export function BaseLayout(props: BaseLayoutProps) {
	return (
		<>
			<Head>
				<title>RE:SIAKAD</title>
			</Head>
			<Image className="-z-20" src="/bg.jpg" alt="Background" fill style={{ objectFit: "cover" }} />
			<div className="fixed bottom-0 left-0 right-0 top-0 -z-10 bg-white/60 backdrop-blur-md" />
			<main className="hidden h-full md:gap-6 md:p-6 xl:flex">
				<Sidebar />
				<motion.div
					className={`relative flex h-full w-full items-center justify-center overflow-y-auto rounded-lg ${
						props.plain ? "" : "bg-white/75 shadow-lg backdrop-blur-lg"
					} scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full`}
				>
					{props.children}
				</motion.div>
			</main>
		</>
	);
}
