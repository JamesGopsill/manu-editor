import { removeTags, replaceWithHTMLEntities } from "./helper-fcns"

export const processPublication = (s: string): string => {
	const publicationMatches = s.match(/<publication>([\s\S]*?)<\/publication>/g)
	let publication = ""
	if (publicationMatches) {
		publication = removeTags("publication", publicationMatches[0])
		publication = publication.trim()
		publication = replaceWithHTMLEntities(publication)
	}
	return publication
}
