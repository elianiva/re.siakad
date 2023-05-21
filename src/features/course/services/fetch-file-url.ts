import { type Lecture, LectureType } from "@prisma/client";
import { ofetch, FetchError } from "ofetch";
import toast from "react-hot-toast";
import { wrapResult } from "~/utils/wrap-result";

type SimpleLecture = Pick<Lecture, "id" | "name" | "type" | "url">;

export async function fetchFileUrl(lecture: SimpleLecture) {
	const isKnownResource = lecture.type === LectureType.resource || lecture.type === LectureType.url;
	if (!isKnownResource) return lecture.url;

	const resourceId = new URL(lecture.url).searchParams.get("id")!;
	const [presignedUrl, fileFetchError] = await wrapResult<string>(
		toast.promise(ofetch(`/api/file/${resourceId}`, { parseResponse: (text) => text }), {
			loading: "Fetching file...",
			error: "Failed to fetch the file",
			success: "File has been fetched successfully",
		})
	);

	if (fileFetchError !== null) {
		if (fileFetchError instanceof FetchError && fileFetchError.status === 403) {
			throw fileFetchError;
		}

		toast.error(fileFetchError.message);
		return null;
	}

	return presignedUrl;
}
