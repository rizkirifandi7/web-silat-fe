/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from "react";
import { JSX, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import type {
	BaseSelection,
	LexicalCommand,
	LexicalEditor,
	NodeKey,
} from "lexical";
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	createCommand,
	DRAGSTART_COMMAND,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_ESCAPE_COMMAND,
} from "lexical";

// import brokenImage from '@/components/editor/images/image-broken.svg';
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { ImageResizer } from "@/components/editor/editor-ui/image-resizer";
import { $isImageNode } from "@/components/editor/nodes/image-node";
import NextImage from "next/image";

const imageCache = new Set();

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
	createCommand("RIGHT_CLICK_IMAGE_COMMAND");

function useSuspenseImage(src: string) {
	if (!imageCache.has(src)) {
		throw new Promise((resolve) => {
			const img = new window.Image();
			img.src = src;
			img.onload = () => {
				imageCache.add(src);
				resolve(null);
			};
			img.onerror = () => {
				imageCache.add(src);
			};
		});
	}
}

function LazyImage({
	altText,
	className,
	imageRef,
	src,
	width,
	height,
	maxWidth,
	onError,
}: {
	altText: string;
	className: string | null;
	height: "inherit" | number;
	imageRef: React.RefObject<HTMLImageElement | null>;
	maxWidth: number;
	src: string;
	width: "inherit" | number;
	onError: () => void;
}): JSX.Element {
	useSuspenseImage(src);
	return (
		<NextImage
			className={className || undefined}
			src={src}
			alt={altText}
			ref={imageRef}
			width={width === "inherit" ? 0 : width}
			height={height === "inherit" ? 0 : height}
			style={{
				maxWidth,
				height: height === "inherit" ? "auto" : height,
				width: width === "inherit" ? "auto" : width,
			}}
			draggable="false"
			onError={onError}
		/>
	);
}

export default function ImageComponent({
	src,
	altText,
	nodeKey,
	width,
	height,
	maxWidth,
	resizable,
	showCaption,
	caption,
	captionsEnabled,
}: {
	altText: string;
	caption: LexicalEditor;
	height: "inherit" | number;
	maxWidth: number;
	nodeKey: NodeKey;
	resizable: boolean;
	showCaption: boolean;
	src: string;
	width: "inherit" | number;
	captionsEnabled: boolean;
}): JSX.Element {
	const imageRef = useRef<HTMLImageElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [editor] = useLexicalComposerContext();
	const [selection, setSelection] = useState<BaseSelection | null>(null);
	const activeEditorRef = useRef<LexicalEditor | null>(null);

	const onDelete = useCallback(
		(payload: KeyboardEvent) => {
			if (isSelected && $isNodeSelection($getSelection())) {
				const event: KeyboardEvent = payload;
				event.preventDefault();
				const node = $getNodeByKey(nodeKey);
				if ($isImageNode(node)) {
					node.remove();
					return true;
				}
			}
			return false;
		},
		[isSelected, nodeKey]
	);

	const onEnter = useCallback(
		(event: KeyboardEvent) => {
			const latestSelection = $getSelection();
			const buttonElem = buttonRef.current;
			if (
				isSelected &&
				$isNodeSelection(latestSelection) &&
				latestSelection.getNodes().length === 1
			) {
				if (showCaption) {
					// Move focus into nested editor
					$setSelection(null);
					event.preventDefault();
					caption.focus();
					return true;
				} else if (
					buttonElem !== null &&
					buttonElem !== document.activeElement
				) {
					event.preventDefault();
					buttonElem.focus();
					return true;
				}
			}
			return false;
		},
		[caption, isSelected, showCaption]
	);

	const onEscape = useCallback(
		(event: KeyboardEvent) => {
			if (
				activeEditorRef.current === caption ||
				buttonRef.current === event.target
			) {
				$setSelection(null);
				editor.update(() => {
					setSelected(true);
					const parentRootElement = editor.getRootElement();
					if (parentRootElement !== null) {
						parentRootElement.focus();
					}
				});
				return true;
			}
			return false;
		},
		[caption, editor, setSelected]
	);

	const onDragStart = (event: React.DragEvent<HTMLImageElement>) => {
		if (event.target === imageRef.current) {
			event.preventDefault();
			return true;
		}
		return false;
	};

	const onRightClick = useCallback(
		(event: MouseEvent) => {
			editor.getEditorState().read(() => {
				const latestSelection = $getSelection();
				const domElement = event.target as HTMLElement;
				if (
					domElement.tagName === "IMG" &&
					$isNodeSelection(latestSelection) &&
					isSelected
				) {
					editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event);
				}
			});
		},
		[editor, isSelected]
	);

	useEffect(() => {
		let isMounted = true;
		const rootElement = editor.getRootElement();
		const unregister = mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				if (isMounted) {
					setSelection(editorState.read(() => $getSelection()));
				}
			}),
			editor.registerCommand(
				CLICK_COMMAND,
				(payload: MouseEvent) => {
					const event = payload;

					if (isResizing) {
						return true;
					}
					if (event.target === imageRef.current) {
						if (event.shiftKey) {
							setSelected(!isSelected);
						} else {
							clearSelection();
							setSelected(true);
						}
						return true;
					}

					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				(event) => {
					if (event.target === imageRef.current) {
						event.preventDefault();
						return true;
					}
					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				KEY_DELETE_COMMAND,
				onDelete,
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				KEY_BACKSPACE_COMMAND,
				onDelete,
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
		);

		rootElement?.addEventListener("contextmenu", onRightClick);

		return () => {
			isMounted = false;
			unregister();
			rootElement?.removeEventListener("contextmenu", onRightClick);
		};
	}, [
		clearSelection,
		editor,
		isResizing,
		isSelected,
		nodeKey,
		onDelete,
		onEnter,
		onEscape,
		onRightClick,
		setSelected,
	]);

	const setShowCaption = () => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setShowCaption(true);
			}
		});
	};

	const onResizeEnd = (
		nextWidth: "inherit" | number,
		nextHeight: "inherit" | number
	) => {
		// Delay hiding the resize bars for click case
		setTimeout(() => {
			setIsResizing(false);
		}, 200);

		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setWidthAndHeight(nextWidth, nextHeight);
			}
		});
	};

	const onResizeStart = () => {
		setIsResizing(true);
	};

	const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
	const isFocused = isSelected || isResizing;
	return (
		<Suspense fallback={null}>
			<>
				<div draggable={draggable} onDragStart={onDragStart}>
					<LazyImage
						className={
							isFocused
								? `focused ${$isNodeSelection(selection) ? "draggable" : ""}`
								: null
						}
						src={src}
						altText={altText}
						imageRef={imageRef}
						width={width}
						height={height}
						maxWidth={maxWidth}
						onError={() => {
							// TODO:
						}}
					/>
				</div>
				{showCaption && (
					<div className="image-caption-container">
						<LexicalNestedComposer
							initialEditor={caption}
							initialTheme={{
								...editor._config.theme,
								namespace: "ImageCaption",
							}}
						>
							<AutoFocusPlugin />
							<HistoryPlugin />
							<RichTextPlugin
								contentEditable={
									<ContentEditable
										className="ImageNode__contentEditable"
										placeholder="Enter a caption..."
									/>
								}
								placeholder={
									<div className="ImageNode__placeholder">
										Enter a caption...
									</div>
								}
								ErrorBoundary={LexicalErrorBoundary}
							/>
						</LexicalNestedComposer>
					</div>
				)}
				{resizable && $isNodeSelection(selection) && isFocused && (
					<ImageResizer
						showCaption={showCaption}
						setShowCaption={setShowCaption}
						editor={editor}
						buttonRef={buttonRef}
						imageRef={imageRef}
						maxWidth={maxWidth}
						onResizeStart={onResizeStart}
						onResizeEnd={onResizeEnd}
						captionsEnabled={captionsEnabled}
					/>
				)}
			</>
		</Suspense>
	);
}
