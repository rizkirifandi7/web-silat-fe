"use client";

import * as React from "react";
import {
	SortingState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Seminar } from "@/types/seminar";
import { columns as seminarColumns } from "./data-table-seminar-columns";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { DeleteSeminarDialog } from "./delete-seminar-dialog";

interface DataTableSeminarProps {
	data: Seminar[];
}

export function DataTableSeminar({ data }: DataTableSeminarProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const {
		form,
		onDelete,
		isDeleting,
		setIsEditDialogOpen,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		selectedSeminar,
		setSelectedSeminar,
	} = useSeminarCrud();

	const handleEdit = (seminar: Seminar) => {
		setSelectedSeminar(seminar);
		form.reset({
			...seminar,
			tanggal_mulai: new Date(seminar.tanggal_mulai),
			tanggal_selesai: new Date(seminar.tanggal_selesai),
		});
		setIsEditDialogOpen(true);
	};

	const handleDelete = (seminar: Seminar) => {
		setSelectedSeminar(seminar);
		setIsDeleteDialogOpen(true);
	};

	const columns = seminarColumns(handleEdit, handleDelete);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	return (
		<div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Tidak ada data.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Sebelumnya
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Berikutnya
				</Button>
			</div>
			{selectedSeminar && (
				<>
					<DeleteSeminarDialog
						isOpen={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}
						onConfirm={onDelete}
						isDeleting={isDeleting}
					/>
				</>
			)}
		</div>
	);
}
