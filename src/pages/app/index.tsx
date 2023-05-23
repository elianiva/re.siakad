import { type ReactNode } from "react";
import { BiChalkboard as CourseIcon, BiDoorOpen as DoorIcon } from "react-icons/bi";
import { BaseLayout } from "~/components/layouts/base-layout";
import { InformationBox, useCourseCount } from "~/features/course";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ScheduleCalendar } from "~/features/calendar";

type BoxProps = {
	icon: ReactNode;
	title: string;
	type: "course" | "meeting" | "lecture";
};
function Box(props: BoxProps) {
	const { data: count = 0, isLoading } = useCourseCount(props.type);

	return (
		<div className="grid grid-cols-[7rem,auto] grid-rows-2 items-center rounded-lg bg-white/75 p-10 shadow-lg backdrop-blur-xl">
			<div className="row-span-2 flex h-24 w-24 items-center justify-center rounded-full bg-orange-200 text-orange-800">
				{props.icon}
			</div>
			<span className="block self-end text-2xl font-medium text-neutral-800">{props.title}</span>
			{isLoading ? (
				<div className="h-8 w-14 animate-pulse self-start rounded-md bg-neutral-200" />
			) : (
				<span className="block self-start text-4xl font-bold">{count}</span>
			)}
		</div>
	);
}

const AppHomePage: NextPageWithLayout = () => {
	return (
		<div className="grid h-full w-full grid-cols-3 grid-rows-[12rem,auto] gap-6">
			<Box type="course" icon={<CourseIcon className="h-12 w-12" />} title="Courses" />
			<Box type="meeting" icon={<DoorIcon className="h-12 w-12" />} title="Meetings" />
			<Box type="lecture" icon={<CourseIcon className="h-12 w-12" />} title="Lectures" />
			<div className="col-span-2 flex items-center justify-center rounded-lg bg-white/75 p-6 shadow-lg backdrop-blur-xl">
				<ScheduleCalendar />
			</div>
			<InformationBox />
		</div>
	);
};

AppHomePage.getLayout = (children) => {
	return <BaseLayout plain>{children}</BaseLayout>;
};

export default AppHomePage;
