import { removeTags, replaceAll } from "./helper-fcns"

export const processTables = (s: string): string => {
	let tables = s.match(/(<table>)([\s\S]*?)(<\/table>)/gm)

	if (!tables) {
		return s
	}

	for (let i = 0; i < tables.length; i++) {
		let table = tables[i]
		let caption = tables[i].match(/<caption>([\s\S]*?)<\/caption>/m)

		if (caption !== null) {
			let captionText = removeTags("caption", caption[0])
			let newCaption = `<caption>Table ${i + 1}: ${captionText}</caption>`
			table = table.replace(caption[0], newCaption)
		}

		// Sorting out the label and replacing the table in the content
		let labelMatch = tables[i].match(/<label>([\s\S]*?)<\/label>/m)

		if (labelMatch !== null) {
			table = table.replace(labelMatch[0], "")
			// replace the existing table with the transpiled table
			s = s.replace(tables[i], table)

			let tableLabel = labelMatch[0]
			tableLabel = removeTags("label", tableLabel)
			tableLabel = tableLabel.trim()

			// Table cross-referencing
			s = replaceAll(s, tableLabel, (i + 1).toString())
		} else {
			s = s.replace(tables[i], table)
		}
	}
	return s
}
