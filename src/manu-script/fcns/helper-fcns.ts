/**
 * Removes a html style tag from a string.
 * @param tag The html style tag to replace
 * @param s The string the contains the html string
 * @returns The string with the tags removed
 */
export const removeTags = (tag: string, s: string): string => {
	s = s.replace(`<${tag}>`, "")
	s = s.replace(`</${tag}>`, "")
	s = s.trim()
	return s
}

/*
export const trim = (s: string) => {
	// Make sure we trim BOM and NBSP
	const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
	s = s.replace(rtrim, "")
	return s
}
*/

/**
 * Replace certain characters with HTML equivalents. Similar to that of LaTeX.
 * @param s The string to replace with HTML equivalents.
 * @returns The string with the HTML equivalents.
 */
export const replaceWithHTMLEntities = (s: string): string => {
	s = replaceAll(s, "&", "&amp;")
	s = replaceAll(s, "''", "&rdquo;")
	s = replaceAll(s, "``", "&ldquo;")
	s = replaceAll(s, "'", "&rsquo;")
	s = replaceAll(s, "`", "&lsquo;")
	return s
}

/**
 * Replaces all occurrences of a string with another string.
 * @param s String the replace substrings in.
 * @param f Substring to find.
 * @param r Substring to replace it with.
 * @returns String with the replacements.
 */
export const replaceAll = (s: string, f: string, r: string): string => {
	return s.replace(new RegExp(f, "g"), r)
}

/**
 * Replaces all occurrences of a string with another string and is case insensitive.
 * @param s String the replace substrings in.
 * @param f Substring to find.
 * @param r Substring to replace it with.
 * @returns String with the replacements.
 */
export const replaceAllCaseInsensitive = (
	s: string,
	f: string,
	r: string
): string => {
	return s.replace(new RegExp(f, "gi"), r)
}
