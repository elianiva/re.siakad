import Image from "next/image";

type StudentCardProps = {
	name: string;
	nim: string;
	photo: string;
};

export function StudentCard(props: StudentCardProps) {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm hover:cursor-pointer">
			<div className="row-span-2">
				<Image className="rounded-full w-12 h-12 object-cover" src={props.photo} width={48} height={48} alt={props.name} />
			</div>
			<h1 className="col-start-2 row-start-1 text-xl font-bold">{props.name} - {props.nim}</h1>
		</div>
	);
}
