import { format } from "date-fns";
import { markdownToHtml } from "~/utils/md-to-html";

type AnnouncementCardProps = {
	name: string;
	timestamp: Date;
	content: string;
};

export function AnnouncementCard(props: AnnouncementCardProps) {
	return (
		<div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
			<div className="flex items-center justify-between gap-2 text-neutral-700">
				<span className="block font-bold">{props.name}</span>
				<span className="block text-sm">{format(props.timestamp, "HH:mm - dd MMMM yyyy")}</span>
			</div>
			<hr className="my-3 h-[1px] w-full bg-neutral-300" />
			<div
				className="prose prose-sm prose-neutral"
				dangerouslySetInnerHTML={{ __html: markdownToHtml(props.content) }}
			/>
		</div>
	);
}
