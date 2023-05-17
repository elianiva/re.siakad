import type { ReactNode } from "react";
import { AiFillHome as HomeIcon } from "react-icons/ai";
import { IoMdPeople as PeopleIcon, IoMdBookmarks as BookmarkIcon } from "react-icons/io";
import { MdScubaDiving as DocentIcon } from "react-icons/md";

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
		icon: <BookmarkIcon className="h-6 w-6" />,
		text: "Courses",
		path: "/app/courses",
	},
	{
		icon: <DocentIcon className="h-6 w-6" />,
		text: "Docents",
		path: "/app/docents",
	},
	{
		icon: <PeopleIcon className="h-6 w-6" />,
		text: "Students",
		path: "/app/students",
	},
];
