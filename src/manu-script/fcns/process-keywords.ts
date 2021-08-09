import { removeTags } from "./helper-fcns"

export const processKeywords = (s: string): string[] => {
	let matches = s.match(/<keyword>([\s\S]*?)<\/keyword>/gim)
	let keywords = []
	if (matches) {
		for (let i = 0; i < matches.length; i++) {
			keywords.push(removeTags("keyword", matches[i]))
		}
	}
	return keywords
}
