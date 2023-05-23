import { marked } from "marked";
import sanitize from "sanitize-html";

export function markdownToHtml(input: string) {
	const sanitized = sanitize(input, { allowedTags: ["h1", "h2", "ul", "li", "ol"] });
	const parsed = marked(sanitized);
	return parsed;
}
