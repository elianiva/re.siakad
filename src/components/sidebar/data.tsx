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
		icon: <HomeIcon className="h-6 w-6" />,
		text: "Overview",
		path: "/app",
	},
	{
		icon: <PeopleIcon className="h-6 w-6" />,
		text: "List of Courses",
		path: "/app/courses",
	},
	{
		icon: <PeopleIcon className="h-6 w-6" />,
		text: "List of Lecturers",
		path: "/app/lecturers",
	},
	{
		icon: <PeopleIcon className="h-6 w-6" />,
		text: "List of Students",
		path: "/app/students",
	},
];
