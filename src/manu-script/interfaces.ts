/**
 * ManuScript is the expected format for the manu-script compiler
 */
export interface ManuScript {
	document: string
	fileData: {
		[key: string]: string
	}
	citations: string
	createdDate: Date
	lastUpdatedDate: Date
	schemaVersion: string
}

export interface Author {
	name: string
	affil: string
}
