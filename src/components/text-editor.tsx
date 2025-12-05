"use client";

import dynamic from "next/dynamic";
import { SerializedEditorState } from "lexical";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load editor component (reduces initial bundle by ~800KB)
const Editor = dynamic(
	() =>
		import("./blocks/editor-x/editor").then((mod) => ({ default: mod.Editor })),
	{
		loading: () => <Skeleton className="h-[400px] w-full" />,
		ssr: false,
	}
);

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
				} catch {
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
