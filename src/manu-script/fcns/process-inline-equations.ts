import katex from "katex"
import { removeTags } from "./helper-fcns"

export const processInlineEquations = (s: string): string => {
	// gets maths within equ
	let tokens = s.match(/<equ>(.*?)<\/equ>/gim)
	if (tokens) {
		for (let i = 0; i < tokens.length; i++) {
			let maths = removeTags("equ", tokens[i])
			maths = katex.renderToString(maths)
			s = s.replace(tokens[i], maths)
		}
	}
	return s
}
