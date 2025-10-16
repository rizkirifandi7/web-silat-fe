"use client";

import { SerializedEditorState } from "lexical";
import { Editor } from "./blocks/editor-x/editor";

interface TextEditorProps {
	value?: SerializedEditorState | string;
	onChange: (value: SerializedEditorState) => void;
}

const initialValue = {
	root: {
		children: [
			{
				children: [],
				direction: null,
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1,
			},
		],
		direction: null,
		format: "",
		indent: 0,
		type: "root",
		version: 1,
	},
} as unknown as SerializedEditorState;

export default function TextEditor({ value, onChange }: TextEditorProps) {
	const getEditorState = (): SerializedEditorState => {
		if (typeof value === "string") {
			if (value) {
				try {
					return JSON.parse(value) as SerializedEditorState;
				} catch (error) {
					console.error("Error parsing editor value:", error);
					// Return initial value if parsing fails
					return initialValue;
				}
			}
			// Return initial value for empty string
			return initialValue;
		}
		// Return value if it's already a SerializedEditorState, otherwise initial value
		return value || initialValue;
	};

	const editorState = getEditorState();

	return (
		<div className="contents">
			<Editor
				editorSerializedState={editorState}
				onSerializedChange={onChange}
			/>
		</div>
	);
}
