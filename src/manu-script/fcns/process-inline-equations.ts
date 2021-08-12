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


export const processInlineEquations = (s: string): string => {

	const adaptor = liteAdaptor();
	const handler = RegisterHTMLHandler(adaptor);
	// AssistiveMmlHandler(handler);

	const tex = new TeX({packages: AllPackages});
	const svg = new SVG({fontCache: 'local'});
	const html = mathjax.document('', {InputJax: tex, OutputJax: svg});

	// gets maths within equ
	let tokens = s.match(/<equ>(.*?)<\/equ>/gim)
	if (tokens) {
		for (let i = 0; i < tokens.length; i++) {
			let maths = removeTags("equ", tokens[i])
			//maths = katex.renderToString(maths)
			let node = html.convert(maths, {
				display: true,
				em: 16,
				ex: 8,
				containerWidth: 80 * 16
			})
			maths = adaptor.outerHTML(node);
			s = s.replace(tokens[i], maths)
		}
	}
	return s
}

/*
import katex from "katex"
import { removeTags } from "./helper-fcns"

export const processInlineEquations = (s: string): string => {
	// gets maths within equ
	let tokens = s.match(/<equ>(.*?)<\/equ>/gim)
	if (tokens) {
		for (let i = 0; i < tokens.length; i++) {
			let maths = removeTags("equ", tokens[i])
			//maths = katex.renderToString(maths)
			maths = "TODO"
			s = s.replace(tokens[i], maths)
		}
	}
	return s
}
*/