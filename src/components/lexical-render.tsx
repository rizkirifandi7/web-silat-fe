// components/LexicalRenderer.jsx
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { nodes } from "./blocks/editor-x/nodes";
import { editorTheme } from "./editor/themes/editor-theme";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

function LexicalRenderer({ editorStateString }: { editorStateString: string }) {
	const initialConfig = {
		editorState: editorStateString,
		editable: false,
		namespace: "LexicalRenderer",
		theme: editorTheme, // Gunakan tema editor Anda di sini
		nodes: nodes, // array [HeadingNode, ListNode, ...etc]
		onError: () => {
			console.error("Error di Lexical Renderer:");
		},
	};

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<RichTextPlugin
				contentEditable={
					<ContentEditable className="lexical-rich-text-renderer" />
				}
				placeholder={null}
				ErrorBoundary={LexicalErrorBoundary}
			/>
		</LexicalComposer>
	);
}

export default LexicalRenderer;