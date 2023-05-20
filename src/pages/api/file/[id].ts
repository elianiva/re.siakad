import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import * as siakadClient from "~/server/siakad-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerAuthSession({ req, res });
	if (session === null) {
		res.status(403).json({
			message: "Guests are now allowed to access the file",
		});
		return;
	}

	const id = req.query.id;
	const response = await siakadClient.fetchFile(id as string);
	console.log({ response });

	res.json({ id });
}
