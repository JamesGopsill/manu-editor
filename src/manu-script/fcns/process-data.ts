import { replaceAll } from "./helper-fcns"

/**
 * Processes any data files and references to them in the paper.
 * @param s String containing references to data files
 * @param fileData Associated file data for the paper.
 * @returns String with file data included.
 */
export const processData = function (
	s: string,
	fileData: { [key: string]: string }
): string {
	let dataTags = s.match(/<data>[\s\S]*?<\/data>/gm)

	if (!dataTags) {
		return s
	}

	let n = 0
	for (let dataXML of dataTags) {
		n++
		let dataReplacementXML = ""

		let dataSrcMatches = dataXML.match(/<src>([\s\S]*?)<\/src>/m)
		if (dataSrcMatches) {
			let key = dataSrcMatches[1]
			key = key.trim()

			if (fileData[key]) {
				dataReplacementXML += `<p class="paper-data"><a href="${fileData[key]}" target="_blank" >Open Data File</a></p>`
			} else {
				dataReplacementXML +=
					'<p class="paper-alert"><b>Warning:</b> Data file could not be found</p>'
			}
		} else {
			dataReplacementXML +=
				'<p class="paper-alert"><b>Warning:</b> Data src could not be found</p>'
		}

		// Captions
		const captionMatches = dataXML.match(/<caption>([\s\S]*?)<\/caption>/m)
		if (captionMatches != null) {
			let caption = captionMatches[1]
			caption = caption.trim()
			dataReplacementXML += `<p class="paper-media-caption">Data ${n}: ${caption}</p>`
		}

		s = s.replace(dataXML, dataReplacementXML)

		// Sorting out the label
		const labelMatches = dataXML.match(/<label>([\s\S]*?)<\/label>/m)
		if (labelMatches != null) {
			let label = labelMatches[1]
			label = label.trim()
			s = replaceAll(s, label, n.toString())
		}
	}
	return s
}
