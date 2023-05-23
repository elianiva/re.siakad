import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { IoMdSend as SendIcon } from "react-icons/io";
import { markdownToHtml } from "~/utils/md-to-html";
import { useAllInformations } from "../../services/all-informations";
import { useSendInformation } from "../../services/send-information";

export function InformationBox() {
	// form
	const [message, setMessage] = useState("");
	const { mutateAsync: sendInformationAsync } = useSendInformation();
	const { data: informations = [], isLoading } = useAllInformations();

	const informationBoxRef = useRef<HTMLDivElement>(null);

	async function handleSubmitInformation() {
		if (message.length <= 0) return;
		setMessage("");
		await toast.promise(sendInformationAsync({ message }), {
			loading: "Sending your message",
			success: "Your message has been sent",
			error: "Failed to send your message",
		});
	}

	useEffect(() => {
		if (informationBoxRef.current === null) return;
		informationBoxRef.current.scrollTop = informationBoxRef.current.scrollHeight + 200;
	}, [informations]);

	return (
		<div className="flex flex-col gap-6 rounded-lg bg-white/75 p-6 shadow-lg backdrop-blur-xl">
			<span className="block text-2xl font-medium">Information Board</span>
			<div
				ref={informationBoxRef}
				className="flex max-h-[32.8rem] flex-1 flex-col gap-4 overflow-y-auto rounded-lg scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full"
			>
				{isLoading ? (
					<>
						<div className="h-32 w-full animate-pulse rounded-lg bg-neutral-200 p-4 shadow-sm"></div>
						<div className="h-48 w-full animate-pulse rounded-lg bg-neutral-200 p-4 shadow-sm"></div>
					</>
				) : (
					informations.map((info, index) => (
						<div key={index} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
							<div className="flex items-center justify-between gap-2 text-neutral-700">
								<span className="block font-bold">{info.student.name}</span>
								<span className="block text-sm">{format(info.createdAt, "HH:mm - dd MMMM yyyy")}</span>
							</div>
							<hr className="my-3 h-[1px] w-full bg-neutral-300" />
							<div
								className="prose prose-sm prose-neutral"
								dangerouslySetInnerHTML={{ __html: markdownToHtml(info.message) }}
							/>
						</div>
					))
				)}
			</div>
			<div className="relative flex">
				<textarea
					value={message}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							void handleSubmitInformation();
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
					onClick={() => void handleSubmitInformation()}
					className="mx-auto w-fit rounded-md bg-orange-400 px-8 text-xl font-bold text-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
				>
					<SendIcon />
				</button>
			</div>
		</div>
	);
}
