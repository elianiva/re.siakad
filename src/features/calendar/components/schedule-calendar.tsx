import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import idID from "date-fns/locale/id";
import { useAllCalendarEvents } from "../services/all-events";
import { Loading } from "~/components/loading";

// pastel colours for calendar events since I can't for some reason figure out how to get the colorId property from google api
// so let's do it manually
const EVENT_COLOUR_MAP: Record<string, string> = {
	"Basis Data": "#2563eb",
	"Praktikum Algoritma dan Struktur Data": "#14b8a6",
	"Rekayasa Perangkat Lunak": "#f97316",
	"Sistem Operasi": "#84cc16",
	Matematika: "#ef4444",
	"Ilmu Komunikasi dan Organisasi": "#8b5cf6",
	"Bahasa Inggris": "#d946ef",
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales: {
		"id-ID": idID,
	},
});

export function ScheduleCalendar() {
	const { data: events, isLoading } = useAllCalendarEvents();
	const normalisedEvents =
		events?.map((event) => ({
			...event,
			start: new Date(event.start!),
			end: new Date(event.end!),
		})) ?? [];

	if (isLoading) return <Loading />;
	return (
		<Calendar
			localizer={localizer}
			events={normalisedEvents}
			defaultView={Views.WEEK}
			startAccessor="start"
			endAccessor="end"
			className="h-auto max-h-[41rem] w-full"
			eventPropGetter={(event) => ({
				style: {
					backgroundColor: !!event.title ? EVENT_COLOUR_MAP[event.title] : "#039BE5",
					borderColor: "transparent",
				},
			})}
		/>
	);
}
