import {
	processAudio,
	processCitations,
	processData,
	processEquations,
	processFigures,
	processHeadings,
	processInlineEquations,
	processTables,
	processVideo,
} from "."
import { ManuScript } from "../interfaces"
import { removeTags, replaceAll, replaceWithHTMLEntities } from "./helper-fcns"

/**
 * Processes the entire content of a PromulJSON and returns the compiled HTML version of the paper.
 * @param d The PromulJSON containing all the information to create the HTML file.
 * @returns The HTML version of the paper.
 */
export const processContent = (d: ManuScript): string => {
	let matches = d.document.match(/<content>([\s\S]*?)<\/content>/gim)
	let content = ""

	if (matches) {
		content = removeTags("content", matches[0])
		content = replaceWithHTMLEntities(content)
		content = processHeadings(content)
		content = processTables(content)
		content = processInlineEquations(content)
		content = processEquations(content)

		content = processFigures(content, d.fileData)
		content = processAudio(content, d.fileData)
		content = processVideo(content, d.fileData)
		content = processData(content, d.fileData)
		content = replaceAll(content, "<ref>", "")
		content = replaceAll(content, "</ref>", "")

		content = replaceAll(content, " <cite>", " [")
		content = replaceAll(content, "<cite>", " [") // add a space to cites that do not have one.
		content = replaceAll(content, "</cite>", "]")

		content = processCitations(content, d.citations)

		// sorting out the paragraphs
		content = replaceAll(content, "\r", "")
		let lines = content.split("\n")
		for (var i = 0; i < lines.length; i++) {
			let line = lines[i]
			if (line && /^[a-z0-9]+$/i.test(line[0])) {
				// if line is not empty and the line starts with a alphanumeric character,
				content = content.replace(lines[i], `<p>${line}</p>`)
			}
		}
	} else {
		content = "Warning: No Content Detected"
	}

	return content
}
