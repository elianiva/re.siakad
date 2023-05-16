import Image from "next/image";
import { PropsWithChildren } from "react";

type BaseLayoutProps = PropsWithChildren;

export function BaseLayout(props: BaseLayoutProps) {
	return (
		<>
			<Image
				className="-z-10 blur-lg brightness-105"
				src="/bg.jpg"
				alt="Background"
				fill
				style={{ objectFit: "cover" }}
			/>
			{props.children}
		</>
	);
}
