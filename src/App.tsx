import { Button, PageHeader, Space, Tag } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import React, { FC, useEffect, useState } from "react"
import MonacoEditor from "react-monaco-editor"
import { compileDocument } from "./manu-script"
import { templateHTML } from "./templates/template"
// @ts-ignore
import welcomeJSON from "./templates/welcome"
import "./App.css"

const App: FC = () => {
	const [fileHandle, setFileHandle] = useState<any>(null)
	const [manuScriptJSON, setManuScriptJSON] = useState<any>({
		...welcomeJSON
	})
	const [height, setHeight] = useState(window.innerHeight - 72)
	const [editorDisplay, setEditorDisplay] = useState("document")
	const [paper, setPaper] = useState("")
	const [filename, setFilename] = useState("welcome.json")



	const openFile = async () => {
		console.log("Open File")
		// @ts-ignore
		const [fH] = await window.showOpenFilePicker({
			types: [
				{
					description: "ManuScript JSON",
					accept: {
						"text/plain": [".json"],
					},
				},
			],
			excludeAcceptAllOption: true,
			multiple: false,
		})
		const file = await fH.getFile()
		const contents = await file.text()
		const json = JSON.parse(contents)
		setManuScriptJSON(json)
		setFileHandle(fH)
		setFilename(fH.name)
	}

	const saveFile = async () => {
		console.log("Save File")
		console.log(manuScriptJSON)
		if (fileHandle) {
			const writable = await fileHandle.createWritable()
			await writable.write(JSON.stringify(manuScriptJSON))
			await writable.close()
		} else {
			await saveFileAs()
		}
	}

	const saveFileAs = async () => {
		console.log("Create new file")
		// @ts-ignore
		const newFileHandle = await window.showSaveFilePicker({
			types: [
				{
					description: "ManuScript JSON",
					accept: {
						"text/plain": [".json"],
					},
				},
			],
		})
		if (newFileHandle) {
			const writable = await newFileHandle.createWritable()
			await writable.write(JSON.stringify(manuScriptJSON))
			await writable.close()
		}
	}

	const newFile = async () => {
		setManuScriptJSON({
			document: templateHTML,
			fileList: {},
			citations: "",
			createdDate: Date.now(),
			lastUpdatedDate: Date.now(),
			schemaVersion: "v0.1.0"
		})
		setFilename("Untitled.json")
		setFileHandle(null)
	}

	const downloadHTML = async () => {
		console.log("Download")
		// @ts-ignore
		const newFileHandle = await window.showSaveFilePicker({
			types: [
				{
					description: "ManuScript HTML",
					accept: {
						"text/plain": [".html"],
					},
				},
			],
		})
		if (newFileHandle) {
			const writable = await newFileHandle.createWritable()
			await writable.write(paper)
			await writable.close()
		}
	}

	const updateDocument = (nV: string, e: any) => {
		setManuScriptJSON((prevState: any) => ({
			...prevState,
			document: nV,
		}))
	}

	const updateCitations = (nV: string, e: any) => {
		setManuScriptJSON((prevState: any) => ({
			...prevState,
			citations: nV,
		}))
	}

	const display = () => {
		if (editorDisplay == "document") {
			return (
				<MonacoEditor
					width="100%"
					height={height}
					language="plaintext"
					theme="vs"
					value={manuScriptJSON.document}
					onChange={updateDocument}
					options={{
						wordWrap: "bounded",
						fontSize: 13
					}}
				/>
			)
		} else if (editorDisplay == "citations") {
			return (
				<MonacoEditor
					width="100%"
					height={height}
					language="plaintext"
					theme="vs"
					value={manuScriptJSON.citations}
					onChange={updateCitations}
					options={{
						wordWrap: "bounded",
						fontSize: 13
					}}
				/>
			)
		} else if (editorDisplay == "media") {
			return (
				<Button>Add Media</Button>
			)
		}
	}

	useEffect(() => {
		const handleResize = () => {
			setHeight(window.innerHeight - 72)
		}
		window.addEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		display()
	}, [editorDisplay])

	useEffect(() => {
		compileDocument(manuScriptJSON).then((html) => {
			setPaper(html)
		})
	}, [manuScriptJSON])

	return (
		<React.Fragment>
			<PageHeader
				title="ManuScript"
				subTitle={filename}
				tags={<Tag color="lime">Alpha</Tag>}
				extra={
					<Space>
						<Button type="link">
							Donate
						</Button>
						<Button onClick={() => setEditorDisplay("document")}>
							Document View
						</Button>
						<Button onClick={() => setEditorDisplay("media")}>
							Media View
						</Button>
						<Button onClick={() => setEditorDisplay("citations")}>
							Citations View
						</Button>
						<Button type="primary" onClick={newFile}>
							New
						</Button>
						<Button type="primary" onClick={openFile}>
							Open
						</Button>
						<Button type="primary" onClick={saveFile}>
							Save
						</Button>
						<Button type="primary" onClick={saveFileAs}>
							Save As
						</Button>
						<Button type="primary" onClick={downloadHTML}>
							<DownloadOutlined /> HTML
						</Button>
					</Space>
				}
			/>
			<div style={{float: "left", width: "50%", overflow: "hidden"}}>
				{display()}
			</div>
			<iframe style={{float: "left", width: "50%", border: "none"}} srcDoc={paper} height={height} />
		</React.Fragment>
	)
}

export default App
