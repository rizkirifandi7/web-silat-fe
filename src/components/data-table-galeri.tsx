"use client";

import * as React from "react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
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
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TambahGaleriDialog } from "@/components/tambah-galeri-dialog";
import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { Galeri } from "@/lib/schema";
import { getGaleriColumns } from "./data-table-galeri-columns";
import { EditGaleriDialog } from "./edit-galeri-dialog";
import { DeleteGaleriDialog } from "./delete-galeri-dialog";
import { IconLayoutColumns } from "@tabler/icons-react";

export function DataTableGaleri() {
	const { galeri, loading, refreshGaleri } = useGaleriCrud();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const [editingGaleri, setEditingGaleri] = React.useState<Galeri | null>(null);
	const [deletingGaleri, setDeletingGaleri] = React.useState<Galeri | null>(
		null
	);

	const handleEdit = (galeri: Galeri) => {
		setEditingGaleri(galeri);
	};

	const handleDelete = (galeri: Galeri) => {
		setDeletingGaleri(galeri);
	};

	const columns = React.useMemo(
		() => getGaleriColumns({ onEdit: handleEdit, onDelete: handleDelete }),
		[]
	);

	const table = useReactTable({
		data: (galeri as Galeri[]) ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full">
			{editingGaleri && (
				<EditGaleriDialog
					galeri={editingGaleri}
					onSuccess={() => {
						refreshGaleri();
						setEditingGaleri(null);
					}}
					onCancel={() => setEditingGaleri(null)}
				/>
			)}
			{deletingGaleri && (
				<DeleteGaleriDialog
					galeriId={deletingGaleri.id}
					onSuccess={() => {
						refreshGaleri();
						setDeletingGaleri(null);
					}}
					onCancel={() => setDeletingGaleri(null)}
				/>
			)}
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Filter judul..."
					value={(table.getColumn("judul")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("judul")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex items-center space-x-4">
					<TambahGaleriDialog onSuccess={refreshGaleri} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								<IconLayoutColumns className="mr-2 h-4 w-4" />
								Kolom
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-muted">
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
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Memuat data...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
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
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
