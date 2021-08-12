import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from 'mathjax-full/js/input/tex'
import { SVG } from 'mathjax-full/js/output/svg'
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js'
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js'
import {AssistiveMmlHandler} from 'mathjax-full/js/a11y/assistive-mml.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import { removeTags, replaceAll } from "./helper-fcns"

const CSS = [
	'svg a{fill:blue;stroke:blue}',
	'[data-mml-node="merror"]>g{fill:red;stroke:red}',
	'[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
	'[data-frame],[data-line]{stroke-width:70px;fill:none}',
	'.mjx-dashed{stroke-dasharray:140}',
	'.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
	'use[data-c]{stroke-width:3px}'
  ].join('');

export const processEquations = (s: string): string => {

	const adaptor = liteAdaptor();
	const handler = RegisterHTMLHandler(adaptor);
	// AssistiveMmlHandler(handler);

	const tex = new TeX({packages: AllPackages});
	const svg = new SVG({fontCache: 'local'});
	const html = mathjax.document('', {InputJax: tex, OutputJax: svg});

	let tokens = s.match(/<equation>([\s\S]*?)<\/equation>/g)

	if (tokens != null) {
		for (let i = 0; i < tokens.length; i++) {
			let maths = removeTags("equation", tokens[i])
			var label = maths.match(/<label>([\s\S]*?)<\/label>/m)
			if (label != null) {
				maths = maths.replace(label[0], "")
			}
			let node = html.convert(maths, {
				display: false,
				em: 16,
				ex: 8,
				containerWidth: 80 * 16
			})
			maths = adaptor.outerHTML(node);
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


	return s
}

/*
import katex from "katex"
import { removeTags, replaceAll } from "./helper-fcns"
*/
/**
 * Processes equations using KaTeX and performs the cross-referencing in the text.
 * @param s String containing equations.
 * @returns String with processed equations.
 */
/*
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
*/