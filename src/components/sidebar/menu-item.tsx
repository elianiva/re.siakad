import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type MenuItemProps = {
	icon: ReactNode;
	text: string;
	path: string;
};

export function MenuItem(props: MenuItemProps) {
	const router = useRouter();
	const isActive = router.pathname === props.path;

	return (
		<Link
			href={props.path}
			className={`${
				isActive ? "bg-orange-300" : "bg-neutral-50"
			} flex items-center gap-4 rounded-lg border-2 border-neutral-900 px-8 py-4 text-xl font-bold`}
		>
			{props.icon}
			<span>{props.text}</span>
		</Link>
	);
}
