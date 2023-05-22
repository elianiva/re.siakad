import { type PropsWithChildren } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import idID from "date-fns/locale/id";
import { BaseLayout } from "~/components/layouts/base-layout";
import { useAllCalendarEvents } from "~/features/calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
	"id-ID": idID,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

// pastel colours for calendar events since I can't for some reason figure out how to get the colorId property from google api
// so let's do it manually
const EVENT_COLOUR_MAP: Record<string, string> = {
	"Basis Data": "#039BE5",
	"Praktikum Algoritma dan Struktur Data": "#33B679",
	"Rekayasa Perangkat Lunak": "#F4511E",
	"Sistem Operasi": "#E67C73",
	Matematika: "#D50000",
	"Ilmu Komunikasi dan Organisasi": "#7986CB",
	"Bahasa Inggris": "#039BE5",
};

function Box(props: PropsWithChildren) {
	return (
		<div className="flex items-center justify-center rounded-lg bg-white/75 shadow-lg backdrop-blur-xl">
			{props.children}
		</div>
	);
}

const AppHomePage: NextPageWithLayout = () => {
	const { data: events, isLoading } = useAllCalendarEvents();
	const normalisedEvents =
		events?.map((event) => ({
			...event,
			start: new Date(event.start!),
			end: new Date(event.end!),
		})) ?? [];

	return (
		<div className="grid h-full w-full grid-cols-3 grid-rows-[12rem,auto] gap-6">
			<Box>Courses</Box>
			<Box>Meetings</Box>
			<Box>Lectures</Box>
			<div className="col-span-3 rounded-lg bg-white/75 p-6 shadow-lg backdrop-blur-xl">
				{isLoading ? (
					"Loading"
				) : (
					<Calendar
						localizer={localizer}
						events={normalisedEvents}
						defaultView={Views.WEEK}
						startAccessor="start"
						endAccessor="end"
						className="h-auto max-h-[41rem]"
						eventPropGetter={(event) => ({
							style: {
								backgroundColor: !!event.title ? EVENT_COLOUR_MAP[event.title] : "#039BE5",
							},
						})}
					/>
				)}
			</div>
		</div>
	);
};

AppHomePage.getLayout = (children) => {
	return <BaseLayout plain>{children}</BaseLayout>;
};

export default AppHomePage;
