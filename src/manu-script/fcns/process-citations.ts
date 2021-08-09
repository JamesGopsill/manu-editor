import bibTeXParse from "bibtex-parser"
import { replaceAllCaseInsensitive } from "./helper-fcns"

/**
 * Processes the citations in the paper.
 * @param s String with citation keys.
 * @param r
 * @returns
 */
export const processCitations = (s: string, r: string): string => {
	let citations = bibTeXParse(r)

	// replace citation idxs
	if (citations) {
		let n = 0
		for (let key in citations) {
			n++
			// add hyperlink if url exists
			if (citations[key].URL) {
				// upper case
				s = replaceAllCaseInsensitive(
					s,
					key,
					`<a href="${citations[key].URL}">${n.toString()}</a>`
				)
			} else {
				s = replaceAllCaseInsensitive(s, key, n.toString())
			}
		}
	}

	return s
}
