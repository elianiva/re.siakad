import { BsChevronRight as ChevronRightIcon, BsFillPersonFill as PersonIcon } from "react-icons/bs";
import { MdClass as MeetingIcon } from "react-icons/md";
import { ImBooks as LectureIcon } from "react-icons/im";
import Avatar from "boring-avatars";
import { type Lecture, type Meeting } from "@prisma/client";
import { useReducer } from "react";
import { MeetingCard } from "./meeting-card";

type CourseMeeting = Pick<Meeting, "id" | "title" | "topic" | "competence"> & {
	lectures: Pick<Lecture, "id" | "name" | "type" | "url">[];
};

type CourseCardProps = {
	title: string;
	docent: string;
	meetings: CourseMeeting[];
};

export function CourseCard(props: CourseCardProps) {
	const [isOpen, toggle] = useReducer((open) => !open, false);
	const lecturesCount = props.meetings.reduce((sum, meeting) => sum + meeting.lectures.length, 0);

	return (
		<div>
			<div
				onClick={toggle}
				className="grid grid-cols-[4rem,1fr,4rem] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm hover:cursor-pointer"
			>
				<div className="row-span-2">
					<Avatar
						variant="bauhaus"
						name={props.title}
						size={48}
						colors={["#38bdf8", "#fde047", "#bef264", "#fdba74"]}
					/>
				</div>
				<h1 className="col-start-2 row-start-1 text-xl font-bold">{props.title}</h1>
				<div className="col-start-2 row-start-2 grid grid-cols-4 items-center gap-8">
					<div className="flex items-center gap-2 text-neutral-700">
						<PersonIcon />
						<span className="text-md">{props.docent}</span>
					</div>
					<div className="flex items-center gap-2 text-neutral-700">
						<MeetingIcon />
						<span className="text-md">{props.meetings.length} Meetings</span>
					</div>
					<div className="flex items-center gap-2 text-neutral-700">
						<LectureIcon />
						<span className="text-md">{lecturesCount} Lectures</span>
					</div>
				</div>
				<div className="row-span-2 self-center justify-self-center">
					<ChevronRightIcon />
				</div>
			</div>
			{isOpen && (
				<div className="mt-4 flex flex-col gap-4 pl-14">
					{props.meetings
						.filter((meeting) => meeting.lectures.length > 0)
						.map((meeting) => (
							<MeetingCard
								key={meeting.title}
								title={meeting.title}
								topic={meeting.topic}
								competence={meeting.competence}
								lectures={meeting.lectures}
							/>
						))}
				</div>
			)}
		</div>
	);
}
