/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	restrictToVerticalAxis,
	restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import TambahKategoriMateriDialog from "@/components/tambah-kategori-materi-dialog";
import { SortableRow } from "./sortable-row";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface DataTableKategoriMateriProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRefresh?: () => void;
	onReorder?: (newData: TData[]) => void;
}

export function DataTableKategoriMateri<TData extends { id: number }, TValue>({
	columns,
	data,
	onRefresh,
	onReorder,
}: DataTableKategoriMateriProps<TData, TValue>) {
	const [activeId, setActiveId] = useState<number | null>(null);
	const [items, setItems] = useState(data);
	const [columnFilters, setColumnFilters] = useState([]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		setItems(data);
	}, [data]);

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: setColumnFilters as any,
		state: {
			columnFilters,
		},
	});

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as number);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = items.findIndex((item) => item.id === active.id);
		const newIndex = items.findIndex((item) => item.id === over.id);

		if (oldIndex !== -1 && newIndex !== -1) {
			const newItems = arrayMove(items, oldIndex, newIndex);
			setItems(newItems);
			onReorder?.(newItems);
		}
	};

	const activeItem = items.find((item) => item.id === activeId);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
		>
			<div className="space-y-4">
				<div className="flex flex-col md:flex-row items-center gap-4">
					<Input
						placeholder="Cari berdasarkan judul kategori..."
						value={(table.getColumn("judul")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("judul")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<div className="ml-auto">
						<TambahKategoriMateriDialog onSuccess={onRefresh} />
					</div>
				</div>

				<Card className="rounded-md border">
					<Table>
						<TableHeader className="bg-muted">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									<TableHead className="w-10"></TableHead>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							<SortableContext
								items={items.map((item) => item.id)}
								strategy={verticalListSortingStrategy}
							>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<SortableRow key={row.original.id} row={row}>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</SortableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length + 1}
											className="h-24 text-center"
										>
											Tidak ada data
										</TableCell>
									</TableRow>
								)}
							</SortableContext>
						</TableBody>
					</Table>
				</Card>

				<DragOverlay>
					{activeId && activeItem ? (
						<Card className="bg-card border p-4 shadow-lg opacity-90 cursor-grabbing">
							<div className="font-medium">
								{(activeItem as any).judul || "Moving..."}
							</div>
						</Card>
					) : null}
				</DragOverlay>
			</div>
		</DndContext>
	);
}
