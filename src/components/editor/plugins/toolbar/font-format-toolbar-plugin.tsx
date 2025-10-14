"use client";

import { useCallback, useState } from "react";
import { $isTableSelection } from "@lexical/table";
import {
	$isRangeSelection,
	BaseSelection,
	FORMAT_TEXT_COMMAND,
	TextFormatType,
} from "lexical";
import {
	BoldIcon,
	ItalicIcon,
	StrikethroughIcon,
	UnderlineIcon,
} from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FORMATS = [
	{ format: "bold", icon: BoldIcon, label: "Bold" },
	{ format: "italic", icon: ItalicIcon, label: "Italic" },
	{ format: "underline", icon: UnderlineIcon, label: "Underline" },
	{ format: "strikethrough", icon: StrikethroughIcon, label: "Strikethrough" },
] as const;

export function FontFormatToolbarPlugin() {
	const { activeEditor } = useToolbarContext();
	const [activeFormats, setActiveFormats] = useState<string[]>([]);

	const $updateToolbar = useCallback((selection: BaseSelection) => {
		if ($isRangeSelection(selection) || $isTableSelection(selection)) {
			const formats: string[] = [];
			FORMATS.forEach(({ format }) => {
				if (selection.hasFormat(format as TextFormatType)) {
					formats.push(format);
				}
			});

			// Prevent re-rendering if the active formats haven't changed
			setActiveFormats((prevFormats) => {
				if (JSON.stringify(prevFormats) === JSON.stringify(formats)) {
					return prevFormats;
				}
				return formats;
			});
		}
	}, []);

	useUpdateToolbarHandler($updateToolbar);

	return (
		<ToggleGroup
			type="multiple"
			value={activeFormats}
			onValueChange={setActiveFormats}
			variant="outline"
			size="sm"
		>
			{FORMATS.map(({ format, icon: Icon, label }) => (
				<ToggleGroupItem
					key={format}
					value={format}
					aria-label={label}
					onClick={() => {
						activeEditor.dispatchCommand(
							FORMAT_TEXT_COMMAND,
							format as TextFormatType
						);
					}}
				>
					<Icon className="h-4 w-4" />
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
