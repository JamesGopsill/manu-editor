import { removeTags, replaceWithHTMLEntities } from "./helper-fcns"

export const processTitle = (xml: string): string => {
	const match = xml.match(/<title>([\s\S]*?)<\/title>/g)
	let title = "Warning: No Title Found"
	if (match) {
		title = removeTags("title", match[0])
		title = title.trim()
		title = replaceWithHTMLEntities(title)
	}
	return title
}
