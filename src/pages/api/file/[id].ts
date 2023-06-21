import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { SiakadFetchError } from "~/server/error/siakad-fetch";
import { UnauthorizedError } from "~/server/error/unauthorized";
import * as siakadClient from "~/server/siakad-client";
import { sentry } from "~/server/utils/sentry";
import { wrapResult } from "~/utils/wrap-result";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerAuthSession({ req, res });
	if (session === null || session.user === undefined) {
		res.status(403).json({ message: "Guests are now allowed to access the file" });
		return;
	}

	const student = await prisma.student.findFirst({
		where: { id: session.user.id },
		select: { nim: true },
	});
	if (student === null) {
		res.status(404).json({ message: "No student found with the credentials you provided" });
		return;
	}
	if (session.user.cookie === undefined) {
		res.status(403).json({ message: "No active session available for this student" });
		return;
	}

	const fileId = req.query.id as string;
	const [response, fetchFileError] = await wrapResult(siakadClient.fetchFile(fileId, session.user.cookie));
	if (fetchFileError !== null) {
		if (fetchFileError instanceof UnauthorizedError) {
			res.status(403).json({ message: "Session has expired" });
			return;
		}

		// NOTE(elianiva): sometimes it can stuck on redirect loop, which is actually caused by an expired token, which should return 403 or soemthing, but no.
		//                 for some reason they don't handle it correctly and choose to infinitely redirect instead.
		//                 at this point I'll stop questioning things, it's just too much.
		//                 now there's no way to know if the server is down or is it just an expired session. you know what, puskom polinema, fuck you
		if (fetchFileError instanceof SiakadFetchError) {
			res.status(403).json({ message: "Session has expired" });
			return;
		}

		sentry.captureException(fetchFileError, (scope) => {
			scope.setContext("course", {
				fileId,
				userId: session.user?.id,
				nim: student.nim,
			});
			return scope;
		});
		res.status(500).json({ message: "Internal server error" });
		return;
	}

	res.send(response);
}
