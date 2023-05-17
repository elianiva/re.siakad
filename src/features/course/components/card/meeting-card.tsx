import { LectureType, type Lecture } from "@prisma/client";
import Link from "next/link";
import { type ReactNode } from "react";
import { IoIosPaper as ResourceIcon } from "react-icons/io";
import { AiFillQuestionCircle as UnknownIcon, AiOutlinePaperClip as UrlIcon } from "react-icons/ai";
import { RiPagesFill as PageIcon } from "react-icons/ri";
import { MdAssignmentTurnedIn as AssignmentIcon, MdQuiz as QuizIcon, MdForum as ForumIcon } from "react-icons/md";

const LECTURE_ICON_MAP: Record<LectureType, ReactNode> = {
	page: <PageIcon />,
	assignment: <AssignmentIcon />,
	quiz: <QuizIcon />,
	forum: <ForumIcon />,
	resource: <ResourceIcon />,
	unknown: <UnknownIcon />,
	url: <UrlIcon />,
};

type MeetingCardProps = {
	title: string;
	topic: string;
	competence: string;
	lectures: Pick<Lecture, "id" | "name" | "type" | "url">[];
};

export function MeetingCard(props: MeetingCardProps) {
	return (
		<div className="rounded-lg border border-neutral-200 bg-white px-6 py-4 shadow-sm">
			<span className="text-md font-bold text-neutral-900">{props.title}</span>
			<div className="grid grid-cols-[7rem,auto] py-2 text-neutral-700">
				<span>Topic:</span>
				<span>{props.topic}</span>
				<span>Competence:</span>
				<span dangerouslySetInnerHTML={{ __html: props.competence }}></span>
			</div>
			<hr className="my-2 h-[1px] w-full bg-neutral-400" />
			<ul className="">
				{props.lectures.map((lecture) => (
					<li key={lecture.url} className="flex items-center gap-3 py-2 text-neutral-800">
						{LECTURE_ICON_MAP[lecture.type]}
						<Link
							className="border-b-2 border-dashed border-sky-400 hover:border-solid"
							href={lecture.type === LectureType.assignment ? `/app/lectures/${lecture.id}` : lecture.url}
						>
							{lecture.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
