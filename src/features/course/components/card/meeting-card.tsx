import { LectureType, type Lecture } from "@prisma/client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { IoIosPaper as ResourceIcon } from "react-icons/io";
import { AiFillQuestionCircle as UnknownIcon, AiOutlinePaperClip as UrlIcon } from "react-icons/ai";
import { RiPagesFill as PageIcon } from "react-icons/ri";
import { MdAssignmentTurnedIn as AssignmentIcon, MdQuiz as QuizIcon, MdForum as ForumIcon } from "react-icons/md";
import { useRouter } from "next/router";
import { AuthPopup, useRefreshSession, type LmsReAuthRequest } from "~/features/auth";
import { toast } from "react-hot-toast";
import { fetchFileUrl } from "../../services/fetch-file-url";
import { wrapResult } from "~/utils/wrap-result";
import { FetchError } from "ofetch";

const LECTURE_ICON_MAP: Record<LectureType, ReactNode> = {
	page: <PageIcon />,
	assignment: <AssignmentIcon />,
	quiz: <QuizIcon />,
	forum: <ForumIcon />,
	resource: <ResourceIcon />,
	unknown: <UnknownIcon />,
	url: <UrlIcon />,
};

type SimpleLecture = Pick<Lecture, "id" | "name" | "type" | "url">;

type MeetingCardProps = {
	title: string;
	topic: string;
	competence: string;
	lectures: SimpleLecture[];
};

export function MeetingCard(props: MeetingCardProps) {
	const router = useRouter();

	// server state
	const { mutateAsync: refreshSessionAsync } = useRefreshSession();

	// local state
	const [isOpen, setOpen] = useState(false);
	const [courseUrl, setCourseUrl] = useState("");

	async function handleResourceClick(lecture: SimpleLecture) {
		const [fileUrl, fileFetchError] = await wrapResult(fetchFileUrl(lecture));
		if (fileFetchError !== null && fileFetchError instanceof FetchError && fileFetchError.status === 403) {
			setCourseUrl(lecture.url);
			setOpen(true);
			return;
		}

		if (fileUrl === null) return;
		await router.push(fileUrl);
	}

	async function handleRefreshSession(data: LmsReAuthRequest) {
		await toast.promise(refreshSessionAsync(data), {
			loading: "Refreshing session...",
			error: "Failed to refresh session",
			success: () => "Session has been refreshed",
		});
		setOpen(false);
	}

	return (
		<>
			<AuthPopup
				isOpen={isOpen}
				onOpenChange={setOpen}
				onSubmit={(data) => void handleRefreshSession({ ...data, courseUrl })}
				description="Your session has expired. Please re-enter your password."
			/>
			<div className="rounded-lg border border-neutral-200 bg-white px-6 py-4 shadow-sm">
				<span className="text-md font-bold text-neutral-900">{props.title}</span>
				<div className="grid grid-cols-[7rem,auto] py-2 text-neutral-700">
					<span>Topic:</span>
					<span dangerouslySetInnerHTML={{ __html: props.topic }}></span>
					<span>Competence:</span>
					<span dangerouslySetInnerHTML={{ __html: props.competence }}></span>
				</div>
				<hr className="my-2 h-[1px] w-full bg-neutral-400" />
				<ul>
					{props.lectures.map((lecture) => {
						const isAssignment = lecture.type === LectureType.assignment;
						return (
							<li key={lecture.url} className="flex items-center gap-3 py-2 text-neutral-800">
								{LECTURE_ICON_MAP[lecture.type]}
								{isAssignment ? (
									<Link
										className="border-b-2 border-dashed border-sky-400 hover:border-solid"
										href={`/app/lectures/${lecture.id}`}
									>
										{lecture.name}
									</Link>
								) : (
									<a
										onClick={(e) => {
											e.preventDefault();
											void handleResourceClick(lecture);
										}}
										className="cursor-pointer border-b-2 border-dashed border-sky-400 hover:border-solid"
									>
										{lecture.name}
									</a>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
}
