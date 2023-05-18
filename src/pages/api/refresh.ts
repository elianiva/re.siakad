import { type NextApiRequest, type NextApiResponse } from "next";
import { refreshContent } from "~/server/refresh-content";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const result = await refreshContent({ credentials: req.body });
	res.status(result.status).json({ message: result.message });
}
