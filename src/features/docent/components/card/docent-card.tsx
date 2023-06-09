import { type Course } from "@prisma/client";
import { BsTelephoneFill as PhoneIcon } from "react-icons/bs";
import { MdEmail as EmailIcon, MdNumbers as NumberIcon } from "react-icons/md";
import { IoIosPaper as ResourceIcon } from "react-icons/io";
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
	return (
		<div className="grid grid-cols-[4rem,1fr,4rem] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm hover:cursor-pointer">
			<div className="row-span-2">
				<Image className="rounded-full" src={props.photo} width={48} height={48} alt={props.name} />
			</div>
			<h1 className="col-start-2 row-start-1 text-xl font-bold">{props.name}</h1>
			<div className="col-start-2 row-start-2 grid grid-cols-4 items-center gap-8">
				<div className="flex items-center gap-2 text-neutral-700">
					<NumberIcon />
					<span className="text-md">{props.nidn ?? "000000000000"}</span>
				</div>
				<div className="flex items-center gap-2 text-neutral-700">
					<EmailIcon />
					<span className="text-md">{props.email}</span>
				</div>
				<div className="flex items-center gap-2 text-neutral-700">
					<PhoneIcon />
					<span className="text-md">{props.phone}</span>
				</div>
				<div className="flex items-center gap-2 text-neutral-700">
					<ResourceIcon />
					<span className="text-md">{props.courses.length} Courses</span>
				</div>
			</div>
		</div>
	);
}
