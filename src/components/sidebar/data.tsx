import type { ReactNode } from "react";
import { AiFillHome as HomeIcon } from "react-icons/ai";
import { IoMdPeople as PeopleIcon } from "react-icons/io";

type MenuItem = {
	icon: ReactNode;
	text: string;
	path: string;
};

export const MENU_ITEMS: MenuItem[] = [
	{
		icon: <HomeIcon />,
		text: "Overview",
		path: "/app",
	},
	{
		icon: <PeopleIcon />,
		text: "List of Students",
		path: "/app/lecturers",
	},
	{
		icon: <PeopleIcon />,
		text: "List of Students",
		path: "/app/students",
	},
];
