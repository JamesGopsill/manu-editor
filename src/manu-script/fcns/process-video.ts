import { replaceAll } from "./helper-fcns"

export const processVideo = (
	s: string,
	fileData: { [key: string]: string }
): string => {
	let videoTags = s.match(/<video>[\s\S]*?<\/video>/gm)

	if (!videoTags) {
		return s
	}

	let n = 0
	for (let vidXML of videoTags) {
		n++

		let vidReplacementXML = ""
		let vidSrcMatches = vidXML.match(/<src>([\s\S]*?)<\/src>/m)

		if (vidSrcMatches) {
			let key = vidSrcMatches[1]
			key = key.trim()

			if (fileData[key]) {
				vidReplacementXML += `<div class="media-div"><video controls><source src="${fileData[key]}"></video></div>`
			} else {
				vidReplacementXML +=
					'<p class="paper-alert"><b>Warning:</b> Could not find video in your files list</p>'
			}
		} else {
			vidReplacementXML +=
				'<p class="paper-alert"><b>Warning:</b> Could not find src tag</p>'
		}

		// Captions
		let captionMatches = vidXML.match(/<caption>([\s\S]*?)<\/caption>/m)
		if (captionMatches != null) {
			let caption = captionMatches[1]
			caption = caption.trim()
			vidReplacementXML += `<p class="paper-media-caption">Video ${
				n + 1
			}: ${caption}</p>`
		}

		s = s.replace(vidXML, vidReplacementXML)

		// Sorting out the label referencing
		let labelMatches = vidXML.match(/<label>([\s\S]*?)<\/label>/m)
		if (labelMatches != null) {
			let label = labelMatches[1]
			label = label.trim()
			s = replaceAll(s, label, n.toString())
		}
	} // for (let videoXML of videoTags)

	return s
}
