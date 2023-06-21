import { StudentRole } from "@prisma/client";
import { format } from "date-fns";
import { useProfile } from "~/features/auth";
import { markdownToHtml } from "~/utils/md-to-html";
import { useRemoveAnnouncement } from "../../services/remove-announcement";
import { toast } from "react-hot-toast";

type AnnouncementCardProps = {
	id: string;
	name: string;
	timestamp: Date;
	content: string;
};

export function AnnouncementCard(props: AnnouncementCardProps) {
	const profile = useProfile();
	const { mutateAsync: removeAnnouncementAsync } = useRemoveAnnouncement();

	async function handleRemoveAnnouncement() {
		await toast.promise(removeAnnouncementAsync({ id: props.id }), {
			loading: "Removing announcement...",
			error: "Failed to remove announcement",
			success: "Announcement has been removed",
		});
	}

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
			{profile?.role === StudentRole.admin && (
				<>
					<hr className="my-3 h-[1px] w-full bg-neutral-300" />
					<button
						className="rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
						onClick={() => void handleRemoveAnnouncement()}
					>
						Remove
					</button>
				</>
			)}
		</div>
	);
}
