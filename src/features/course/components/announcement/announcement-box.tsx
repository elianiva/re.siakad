import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { IoMdSend as SendIcon } from "react-icons/io";
import { useAllAnnouncements } from "../../services/all-announcements";
import { useSendAnnouncement } from "../../services/send-announcement";
import { AnnouncementCard } from "./announcement-card";

export function AnnouncementBox() {
	// form
	const [message, setMessage] = useState("");
	const { mutateAsync: sendAnnouncementAsync } = useSendAnnouncement();
	const { data: announcements = [], isLoading } = useAllAnnouncements();

	const announcementBoxRef = useRef<HTMLDivElement>(null);

	async function handleSubmitAnnouncement() {
		if (message.length <= 0) return;
		setMessage("");
		await toast.promise(sendAnnouncementAsync({ message }), {
			loading: "Sending your message",
			success: "Your message has been sent",
			error: "Failed to send your message",
		});
	}

	useEffect(() => {
		if (announcementBoxRef.current === null) return;
		announcementBoxRef.current.scrollTop = announcementBoxRef.current.scrollHeight + 200;
	}, [announcements]);

	return (
		<div className="grid grid-rows-[2rem,auto,3.4rem] gap-6 rounded-lg bg-white/75 p-6 shadow-lg backdrop-blur-xl">
			<span className="block text-2xl font-medium">Announcement Board</span>
			<div
				ref={announcementBoxRef}
				className={`${
					announcements.length < 1 ? "justify-center" : "justify-start"
				} flex h-full max-h-[32.8rem] flex-1 flex-col gap-4 overflow-y-auto rounded-lg scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full`}
			>
				{isLoading ? (
					<>
						<div className="h-32 w-full animate-pulse rounded-lg bg-neutral-200 p-4 shadow-sm"></div>
						<div className="h-48 w-full animate-pulse rounded-lg bg-neutral-200 p-4 shadow-sm"></div>
					</>
				) : announcements.length < 1 ? (
					<span className="text-center text-neutral-500">No announcement has been posted yet</span>
				) : (
					announcements.map((announcement) => (
						<AnnouncementCard
							key={announcement.createdAt.toISOString()}
							id={announcement.id}
							timestamp={announcement.createdAt}
							content={announcement.message}
							name={announcement.student.name}
						/>
					))
				)}
			</div>
			<div className="relative flex">
				<textarea
					value={message}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							void handleSubmitAnnouncement();
						}
					}}
					onChange={(e) => {
						if (e.target.value === "\n") return;
						if (message.length > 1024) return;
						setMessage(e.target.value);
					}}
					className="mr-4 w-full flex-1 resize-none rounded-lg border border-neutral-300 bg-white/50 px-4 py-3 text-lg font-medium text-neutral-800 outline-1 outline-orange-600 scrollbar-none placeholder:text-lg"
					placeholder="Type your message here"
					rows={1}
				/>
				<button
					disabled={message.length <= 0}
					onClick={() => void handleSubmitAnnouncement()}
					className="mx-auto w-fit rounded-md bg-orange-400 px-8 text-xl font-bold text-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
				>
					<SendIcon />
				</button>
			</div>
		</div>
	);
}
