import { replaceAll } from "./helper-fcns"

/**
 * Processes any audio content in the paper
 * @param s String potentially containing audio links.
 * @param fileData The file data accompanying the paper content.
 * @returns Embedded audio content in the paper.
 */
export const processAudio = (
	s: string,
	fileData: { [key: string]: string }
): string => {
	let audio = s.match(/(<audio>)([\s\S]*?)(<\/audio>)/gm)

	if (!audio) {
		return s
	}

	let n = 0
	for (let audioXML of audio) {
		n++
		let audioReplacementXML = ""

		let audioSrcMatch = audioXML.match(/<src>([\s\S]*?)<\/src>/m)
		if (audioSrcMatch) {
			let key = audioSrcMatch[1]
			key = key.trim()

			if (fileData[key]) {
				audioReplacementXML += `<div class="media-div"><audio controls><source src="${fileData[key]}"></audio></div>`
			} else {
				audioReplacementXML +=
					'<p class="paper-alert"><b>Warning:</b> Audio file could not be found</p>'
			}
		} else {
			audioReplacementXML +=
				'<p class="paper-alert"><b>Warning:</b> Audio src tag could not be found</p>'
		}

		// Sorting out the audio caption
		let captionMatch = audioXML.match(/<caption>([\s\S]*?)<\/caption>/m)
		if (captionMatch) {
			let caption = captionMatch[1]
			caption = caption.trim()
			audioReplacementXML += `<p class="paper-media-caption">Audio ${n.toString()}: ${caption}</p>`
		}

		s = s.replace(audioXML, audioReplacementXML)

		// Replacing all the references to the label with the number
		let labelMatch = audioXML.match(/<label>([\s\S]*?)<\/label>/m)
		if (labelMatch != null) {
			let label = labelMatch[1]
			label = label.trim()
			s = replaceAll(s, label, n.toString())
		}
	} // end for (let audioXML of audio)
	return s
}
