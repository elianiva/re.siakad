import { BsChevronRight as ChevronRightIcon, BsFillPersonFill as PersonIcon } from "react-icons/bs";
import { MdClass as MeetingIcon } from "react-icons/md";
import { ImBooks as LectureIcon } from "react-icons/im";
import { type Course } from "@prisma/client";
import { useReducer } from "react";
import Image from "next/image";

type DocentCourse = Pick<Course, "title">;

type DocentCardProps = {
	name: string;
	email: string;
	nidn: string;
	phone: string;
	photo: string;
	courses: DocentCourse[];
};

export function DocentCard(props: DocentCardProps) {
	const [isOpen, toggle] = useReducer((open) => !open, false);

	return (
		<div>
			<div
				onClick={toggle}
				className="grid grid-cols-[4rem,1fr,4rem] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm hover:cursor-pointer"
			>
				<div className="row-span-2">
					<Image className="rounded-full" src={props.photo} width={48} height={48} alt={props.name} />
				</div>
				<h1 className="col-start-2 row-start-1 text-xl font-bold">{props.name}</h1>
				<div className="col-start-2 row-start-2 grid grid-cols-4 items-center gap-8">
					<div className="flex items-center gap-2 text-neutral-700">
						<PersonIcon />
						<span className="text-md">{props.nidn ?? "000000000000"}</span>
					</div>
					<div className="flex items-center gap-2 text-neutral-700">
						<MeetingIcon />
						<span className="text-md">{props.email}</span>
					</div>
					<div className="flex items-center gap-2 text-neutral-700">
						<LectureIcon />
						<span className="text-md">{props.phone}</span>
					</div>
				</div>
				<div className="row-span-2 self-center justify-self-center">
					<ChevronRightIcon />
				</div>
			</div>
			{isOpen && <div className="mt-4 flex flex-col gap-4 pl-14">hel</div>}
		</div>
	);
}
