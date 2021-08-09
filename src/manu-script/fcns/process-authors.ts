import { Author } from "../interfaces"

/**
 * Processes the authors of the paper.
 * @param s String containing author tags.
 * @returns An array of authors and their affiliations.
 */
export const processAuthors = (s: string): Author[] => {
	let matches = s.match(/<author>([\s\S]*?)<\/author>/gim)
	let authors = []
	if (matches) {
		for (let i = 0; i < matches.length; i++) {
			let str = matches[i]
			let author: Author = {
				name: "",
				affil: "",
			}
			let name = str.match(/<name>([\s\S]*?)<\/name>/im)
			if (name) {
				author.name = name[1]
			}
			let affil = str.match(/<affil>([\s\S]*?)<\/affil>/im)
			if (affil) {
				author.affil = affil[1]
			}
			authors.push(author)
		}
	}
	return authors
}
