import { removeTags, replaceAll, replaceWithHTMLEntities } from "./helper-fcns"

/**
 * Processes the abstract of the paper.
 * @param s String containing the abstract.
 * @returns The abstract HTML string.
 */
export const processAbstract = (s: string): string => {
	let match = s.match(/<abstract>([\s\S]*?)<\/abstract>/gim)
	let temp = ""
	let abstract = ""

	if (match) {
		temp = removeTags("abstract", match[0])
		temp = replaceAll(temp, "\r", "")
		let lines = temp.split("\n")

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i]

			// if line is not empty and the line starts with a alphanumeric character
			if (line && /^[a-z0-9]+$/i.test(line[0])) {
				abstract += `<p>${line}</p>`
			} else {
				abstract += line
			}
		}
	}

	abstract = replaceWithHTMLEntities(abstract)
	return abstract
}
