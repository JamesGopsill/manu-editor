import katex from "katex"
import { removeTags, replaceAll } from "./helper-fcns"

/**
 * Processes equations using KaTeX and performs the cross-referencing in the text.
 * @param s String containing equations.
 * @returns String with processed equations.
 */
export const processEquations = (s: string): string => {
	let tokens = s.match(/<equation>([\s\S]*?)<\/equation>/g)

	if (tokens != null) {
		for (let i = 0; i < tokens.length; i++) {
			let maths = removeTags("equation", tokens[i])
			var label = maths.match(/<label>([\s\S]*?)<\/label>/m)
			if (label != null) {
				maths = maths.replace(label[0], "")
			}
			maths = katex.renderToString(maths, { displayMode: true })
			maths = replaceAll(maths, "\n", "")
			s = s.replace(
				tokens[i],
				`<div class="paper-equation">${maths}</div>
				<p class="paper-equation-caption">(${i + 1})</p>`
			)
			if (label != null) {
				s = replaceAll(s, label[1], (i + 1).toString())
			}
		}
	}
	return s
}
