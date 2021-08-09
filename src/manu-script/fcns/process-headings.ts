import { removeTags } from "./helper-fcns"

export const processHeadings = (s: string): string => {
	let headings = s.match(/(<h1>|<h2>|<h3>)([\s\S]*?)(<\/h1>|<\/h2>|<\/h3>)/gm)
	let h1Increment = 0
	let h2Increment = 0
	let h3Increment = 0
	if (!headings) {
		return s
	}
	for (let i = 0; i < headings.length; i++) {
		let heading = headings[i]
		let newHeading = ""
		if (heading.indexOf("<h1>") === 0) {
			h1Increment++
			h2Increment = 0
			h3Increment = 0
			newHeading += "<h1>"
			newHeading += h1Increment + ". "
			newHeading += removeTags("h1", heading)
			newHeading += "</h1>"
		}
		if (heading.indexOf("<h2>") === 0) {
			h2Increment++
			h3Increment = 0
			newHeading += "<h2>"
			newHeading += h1Increment + "." + h2Increment + ". "
			newHeading += removeTags("h2", heading)
			newHeading += "</h2>"
		}
		if (heading.indexOf("<h3>") === 0) {
			h3Increment++
			newHeading += "<h3>"
			newHeading += h1Increment + "." + h2Increment + "." + h3Increment + ". "
			newHeading += removeTags("h3", heading)
			newHeading += "</h3>"
		}
		s = s.replace(heading, newHeading)
	}
	return s
}
