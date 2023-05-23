import Image from "next/image";
import { FiLogOut as LogOutIcon } from "react-icons/fi";
import { IoMdRefresh as RefreshIcon } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useSignOut, useProfile, useRefreshSiakadData, AuthPopup, type ReAuthRequest } from "~/features/auth";
import { type RefreshContentResult } from "~/server/refresh-content";
import { MENU_ITEMS } from "./data";
import { MenuItem } from "./menu-item";
import { useState } from "react";

export function Sidebar() {
	// server state
	const profile = useProfile();
	const { mutate: signOut } = useSignOut();
	const { mutateAsync: refreshSiakadDataAsync } = useRefreshSiakadData();

	// local state
	const [isOpen, setOpen] = useState(false);
	const [isMinimised, setMinimised] = useState(false);

	function handleSignOut() {
		signOut();
	}

	async function refreshSiakadData(data: ReAuthRequest) {
		await toast.promise(refreshSiakadDataAsync(data), {
			error: (result: RefreshContentResult) => `Failed to refresh SIAKAD data. Reason: ${result.message}`,
			loading: "Refreshing SIAKAD data",
			success: "SIAKAD data has been refreshed",
		});
		setOpen(false);
	}

	return (
		<aside
			className={`flex h-full ${
				isMinimised ? "w-[5rem]" : "w-[32rem]"
			} flex-col gap-2 rounded-xl bg-white/75 shadow-lg backdrop-blur-md`}
		>
			<Image
				className="absolute left-1/2 mx-auto -translate-x-1/2 py-10"
				src="/logo-wide.png"
				width={240}
				height={40}
				alt="RE:SIAKAD logo"
				onClick={() => setMinimised((prev) => !prev)}
			/>
			<div className="mt-40 flex flex-1 flex-col">
				{MENU_ITEMS.map((menu) => (
					<MenuItem key={menu.path} hideText={isMinimised} {...menu} />
				))}
			</div>
			<hr className="mx-auto h-[2px] w-4/5 bg-neutral-300" />
			{profile !== undefined && (
				<div
					className={`${
						isMinimised
							? "flex items-center justify-center p-4"
							: "grid grid-cols-[4rem,auto,3rem,3rem] grid-rows-2 gap-x-3 p-6"
					}`}
				>
					<Image
						className={`row-span-2 ${isMinimised ? "h-10 w-10" : "h-14 w-14"} rounded-full object-cover`}
						src={profile.photo}
						width={40}
						height={40}
						alt={profile.name}
					/>
					{!isMinimised && (
						<>
							<span className="self-end text-lg font-bold text-neutral-900">{profile.name}</span>
							<span className="col-start-2 row-start-2 text-sm text-neutral-600">{profile.nim}</span>
							{profile.role === "admin" && (
								<button className="col-start-3 row-span-3 cursor-pointer self-center justify-self-center text-neutral-400 hover:text-neutral-800">
									<AuthPopup
										isOpen={isOpen}
										onOpenChange={setOpen}
										description="We need your credentials to refresh the entire SIAKAD database. This is needed because we never store your plain SIAKAD password."
										icon={
											<div>
												<RefreshIcon className="h-6 w-6" />
											</div>
										}
										onSubmit={(data) => void refreshSiakadData(data)}
									/>
								</button>
							)}
							<button
								className="col-start-4 row-span-2 self-center justify-self-center text-neutral-400 hover:text-neutral-800"
								onClick={handleSignOut}
							>
								<LogOutIcon className="h-6 w-6" />
							</button>
						</>
					)}
				</div>
			)}
		</aside>
	);
}
