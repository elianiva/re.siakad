import Image from "next/image";
import { FiLogOut as LogOutIcon } from "react-icons/fi";
import { useProfile } from "~/features/auth/services/useProfile";
import { MENU_ITEMS } from "./data";
import { MenuItem } from "./menu-item";
import { useSignOut } from "~/features/auth/services/useSignOut";

export function Sidebar() {
	const profile = useProfile();
	const { mutate: signOut } = useSignOut();

	function handleSignOut() {
		signOut();
	}

	return (
		<aside className="flex h-full w-full flex-col gap-2 rounded-xl bg-white/75 shadow-lg backdrop-blur-md">
			<Image className="mx-auto py-10" src="/logo-wide.png" width={240} height={40} alt="RE:SIAKAD logo" />
			<div className="flex flex-1 flex-col">
				{MENU_ITEMS.map((menu) => (
					<MenuItem key={menu.path} {...menu} />
				))}
			</div>
			<hr className="mx-auto h-[2px] w-4/5 bg-neutral-300" />
			{profile !== undefined && (
				<div className="col-gap-2 row-gap-1 grid grid-cols-[1fr,3fr,1fr] grid-rows-2 p-6">
					<Image
						className="row-span-2 h-14 w-14 rounded-full object-cover"
						src={profile.photo}
						width={40}
						height={40}
						alt={profile.name}
					/>
					<span className="self-end text-lg font-bold text-neutral-900">{profile.name}</span>
					<span className="col-start-2 row-start-2 text-sm text-neutral-600">{profile.nim}</span>
					<button
						className="col-start-3 row-span-2 self-center justify-self-center text-neutral-400 hover:text-neutral-800"
						onClick={handleSignOut}
					>
						<LogOutIcon className="h-6 w-6" />
					</button>
				</div>
			)}
		</aside>
	);
}
