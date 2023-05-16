import { BsChevronRight as ChevronRightIcon } from "react-icons/bs";
import Avatar from "boring-avatars";

type CardProps = {
	title: string;
	subtitle: string;
};

export function Card(props: CardProps) {
	return (
		<div className="grid grid-cols-[4rem,1fr,4rem] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
			<div className="row-span-2">
				<Avatar
					variant="bauhaus"
					name={props.title}
					size={48}
					colors={["#38bdf8", "#fde047", "#bef264", "#fdba74"]}
				/>
			</div>
			<h1 className="col-start-2 row-start-1 text-xl font-bold">{props.title}</h1>
			<span className="col-start-2 row-start-2">{props.subtitle}</span>
			<div className="row-span-2 self-center justify-self-center">
				<ChevronRightIcon />
			</div>
		</div>
	);
}
