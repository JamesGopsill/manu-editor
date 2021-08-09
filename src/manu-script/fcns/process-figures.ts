import { replaceAll } from "./helper-fcns"

/**
 *
 * @param s String containing Figure tags.
 * @param fileData Supporting file data for the html doc.
 * @returns
 */
export const processFigures = function (
	s: string,
	fileData: { [key: string]: string }
): string {
	let figures = s.match(/(<figure>)([\s\S]*?)(<\/figure>)/gm)

	if (!figures) {
		return s
	}

	let n = 0
	for (let figXML of figures) {
		n++
		let figReplacementXML = "<figure>"

		let figMatches = figXML.match(/<file>([\s\S]*?)<\/file>/m)
		if (figMatches) {
			let figFile = figMatches[1]
			figFile = figFile.trim()
			if (fileData[figFile]) {
				figReplacementXML += `<img class="paper-img" src="${fileData[figFile]}" />`
			} else {
				figReplacementXML += "NO IMAGE FOUND"
			}
		}

		let captionMatches = figXML.match(/<caption>([\s\S]*?)<\/caption>/m)
		let caption = ""
		if (captionMatches != null) {
			caption = captionMatches[1]
			caption = caption.trim()
		} else {
			caption = "No Caption Detected"
		}
		figReplacementXML += `<figcaption>Figure ${n}: ${caption}</figcaption>`
		figReplacementXML += "</figure>"

		s = s.replace(figXML, figReplacementXML)

		let labelMatch = figXML.match(/<label>([\s\S]*?)<\/label>/m)
		if (labelMatch) {
			let label = labelMatch[1]
			label = label.trim()
			s = replaceAll(s, label, n.toString())
		}
	}
	return s
}
