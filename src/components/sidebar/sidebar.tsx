import Image from "next/image";
import { MENU_ITEMS } from "./data";
import { MenuItem } from "./menu-item";

export function Sidebar() {
	return (
		<aside className="h-full w-full rounded-xl border-2 border-neutral-900 bg-white p-8">
			<Image src="/logo-wide.png" width={200} height={40} alt="RE:SIAKAD logo" />
			<div className="mt-10 flex flex-col gap-4">
				{MENU_ITEMS.map((menu) => (
					<MenuItem key={menu.path} {...menu} />
				))}
			</div>
		</aside>
	);
}
