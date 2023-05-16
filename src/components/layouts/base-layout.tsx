import Image from "next/image";
import type { PropsWithChildren } from "react";
import { Sidebar } from "../sidebar/sidebar";

type BaseLayoutProps = PropsWithChildren;

export function BaseLayout(props: BaseLayoutProps) {
	return (
		<>
			<Image className="-z-20" src="/bg.jpg" alt="Background" fill style={{ objectFit: "cover" }} />
			<div className="fixed bottom-0 left-0 right-0 top-0 -z-10 bg-white/60 backdrop-blur-md" />
			<main className="grid h-full grid-cols-[26rem,1fr] gap-6 p-6">
				<Sidebar />
				<div className="relative flex h-full items-center justify-center overflow-y-auto rounded-lg bg-white/75 shadow-lg backdrop-blur-lg">
					{props.children}
				</div>
			</main>
		</>
	);
}
