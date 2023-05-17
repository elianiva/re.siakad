import { BsTelephoneFill as PhoneIcon } from "react-icons/bs";
import { MdEmail as EmailIcon, MdNumbers as NumberIcon } from "react-icons/md";
import Image from "next/image";

type StudentCardProps = {
	name: string;
	email: string;
	nim: string;
	phone: string;
	photo: string;
};

export function StudentCard(props: StudentCardProps) {
	return (
		<div className="grid grid-cols-[4rem,1fr,4rem] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm hover:cursor-pointer">
			<div className="row-span-2">
				<Image className="rounded-full" src={props.photo} width={48} height={48} alt={props.name} />
			</div>
			<h1 className="col-start-2 row-start-1 text-xl font-bold">{props.name}</h1>
			<div className="col-start-2 row-start-2 grid grid-cols-4 items-center gap-8">
				<div className="flex items-center gap-2 text-neutral-700">
					<NumberIcon />
					<span className="text-md">{props.nim ?? "000000000000"}</span>
				</div>
				<div className="flex items-center gap-2 text-neutral-700">
					<EmailIcon />
					<span className="text-md">{props.email}</span>
				</div>
				<div className="flex items-center gap-2 text-neutral-700">
					<PhoneIcon />
					<span className="text-md">{props.phone}</span>
				</div>
			</div>
		</div>
	);
}
