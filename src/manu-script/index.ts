import bibTeXParse from "bibtex-parser"
import fs from "fs"
import {
	processAbstract,
	processAuthors,
	processContent,
	processKeywords,
	processPublication,
	processTitle,
} from "./fcns"
import { replaceAll } from "./fcns/helper-fcns"
import { ManuScript } from "./interfaces"

/**
 * compileDocument compilse a promulJSON into a full content-embedded html file for publishing on the web or sharing and viewing in a browser.
 * @param json
 * @returns compiled html document
 */
export const compileDocument = async (d: ManuScript): Promise<string> => {
	const title = processTitle(d.document)
	const authors = processAuthors(d.document)
	const abstract = processAbstract(d.document)
	const keywords = processKeywords(d.document)
	const publication = processPublication(d.document)

	const content = processContent(d)

	const citations = bibTeXParse(d.citations)

	// Load the template

	let paper = fs.readFileSync(__dirname + "/static/paper.hbs", "utf8")

	const css = fs.readFileSync(__dirname + "/static/paper.css", "utf8")

	paper = paper.replace("{{style}}", css)
	paper = replaceAll(paper, "{{title}}", title)
	paper = paper.replace("{{abstract}}", abstract)
	paper = paper.replace("{{content}}", content)
	paper = paper.replace("{{publication}}", publication)

	let authorHTML = ""
	for (const author of authors) {
		authorHTML += `<li>${author.name} - ${author.affil}</li>`
	}
	paper = paper.replace("{{authors}}", authorHTML)

	let keywordHTML = ""
	for (const keyword of keywords) {
		keywordHTML += `<li>${keyword}</li>`
	}
	paper = paper.replace("{{keywords}}", keywordHTML)

	let citationHTML = "<ol class='citations'>"
	for (const [key, citation] of Object.entries<any>(citations)) {
		if (citation.URL) {
			citationHTML += `<a href="${citation.URL}"><li>${citation.AUTHOR}. ${citation.TITLE}. ${citation.JOURNAL}, ${citation.YEAR}</li></a>`
		} else {
			citationHTML += `<li>${citation.AUTHOR}. ${citation.TITLE}. ${citation.JOURNAL}, ${citation.YEAR}</li>`
		}
	}
	citationHTML += "</ol>"
	paper = paper.replace("{{citations}}", citationHTML)

	return paper
}
