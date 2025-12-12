"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow } from "@/components/ui/table";
import { Row } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";

interface SortableRowProps<TData> {
	row: Row<TData>;
	children: React.ReactNode;
}

export function SortableRow<TData extends { id: number }>({
	row,
	children,
}: SortableRowProps<TData>) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: row.original.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			data-state={row.getIsSelected() && "selected"}
			className={isDragging ? "relative z-50" : ""}
		>
			<td className="p-2 w-10">
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
				>
					<GripVertical className="h-5 w-5 text-muted-foreground" />
				</button>
			</td>
			{children}
		</TableRow>
	);
}
