import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type MenuItemProps = {
	icon: ReactNode;
	text: string;
	path: string;
	hideText: boolean;
};

export function MenuItem(props: MenuItemProps) {
	const router = useRouter();
	const isActive = router.pathname === props.path;

	return (
		<Link
			href={props.path}
			className={`${
				isActive ? "border-orange-700 bg-gradient-to-r from-orange-200 to-transparent" : "border-transparent"
			} flex items-center gap-4 border-l-4 px-4 py-2 text-lg font-bold`}
		>
			<div className={`rounded-full p-2 ${isActive ? "text-orange-700" : "text-neutral-700"}`}>{props.icon}</div>
			{!props.hideText && <span className={isActive ? "text-orange-700" : "text-neutral-700"}>{props.text}</span>}
		</Link>
	);
}
