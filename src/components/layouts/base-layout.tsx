import Image from "next/image";
import type { PropsWithChildren } from "react";
import { Sidebar } from "../sidebar/sidebar";

type BaseLayoutProps = PropsWithChildren;

export function BaseLayout(props: BaseLayoutProps) {
	return (
		<>
			<Image className="-z-20" src="/bg.jpg" alt="Background" fill style={{ objectFit: "cover" }} />
			<div className="fixed bottom-0 left-0 right-0 top-0 -z-10 bg-[rgba(255,255,255,0.6)] backdrop-blur-md" />
			<main className="grid h-full grid-cols-[26rem,1fr]">
				<div className="p-6">
					<Sidebar />
				</div>
				<div className="relative flex items-center justify-center">{props.children}</div>
			</main>
		</>
	);
}
