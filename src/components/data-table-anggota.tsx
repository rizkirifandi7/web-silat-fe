"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { IconLayoutColumns } from "@tabler/icons-react";
import { Anggota } from "@/lib/schema";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { DetailAnggotaDrawer } from "./detail-anggota-drawer";
import { EditAnggotaDialog } from "./edit-anggota-dialog";
import { KartuAnggotaDialog } from "./kartu-anggota-dialog";
import { TambahAnggotaDialog } from "./tambah-anggota-dialog";
import { Card } from "./ui/card";
import { useAnggotaTable } from "@/hooks/use-anggota-table";
import { getAnggotaColumns } from "./data-table-anggota-columns";

export function DataTableAnggota({ data: initialData }: { data: Anggota[] }) {
	const {
		data,
		sorting,
		columnFilters,
		columnVisibility,
		setSorting,
		setColumnFilters,
		setColumnVisibility,
		handleAddAnggota,
		handleUpdateAnggota,
		handleDeleteAnggota,
	} = useAnggotaTable(initialData);

	const [detailAnggota, setDetailAnggota] = React.useState<Anggota | null>(
		null
	);
	const [editAnggota, setEditAnggota] = React.useState<Anggota | null>(null);
	const [kartuAnggota, setKartuAnggota] = React.useState<Anggota | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
	const [isKartuDialogOpen, setIsKartuDialogOpen] = React.useState(false);

	const handleViewDetails = React.useCallback((anggota: Anggota) => {
		setDetailAnggota(anggota);
		setIsDrawerOpen(true);
	}, []);

	const handleEdit = React.useCallback((anggota: Anggota) => {
		setEditAnggota(anggota);
		setIsEditDialogOpen(true);
	}, []);

	const handleViewCard = React.useCallback((anggota: Anggota) => {
		setKartuAnggota(anggota);
		setIsKartuDialogOpen(true);
	}, []);

	const columns = React.useMemo(
		() =>
			getAnggotaColumns({
				onViewDetails: handleViewDetails,
				onEdit: handleEdit,
				onViewCard: handleViewCard,
				onDelete: handleDeleteAnggota,
			}),
		[handleViewDetails, handleEdit, handleViewCard, handleDeleteAnggota]
	);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	return (
		<div className="w-full">
			<div className="flex flex-col md:flex-row items-center py-4">
				<Input
					placeholder="Cari berdasarkan nama..."
					value={
						(table.getColumn("nama_lengkap")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("nama_lengkap")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="ml-auto flex items-center gap-2 w-full py-2 md:w-auto md:py-0">
					<TambahAnggotaDialog onAnggotaAdded={handleAddAnggota} />
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
			<Card className="rounded-md border py-0">
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					Total {table.getFilteredRowModel().rows.length} anggota.
				</div>
				<div className="space-x-2">
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
			</div>
			<DetailAnggotaDrawer
				anggota={detailAnggota}
				isOpen={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
			/>
			<EditAnggotaDialog
				anggota={editAnggota}
				isOpen={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				onAnggotaUpdated={handleUpdateAnggota}
			/>
			<KartuAnggotaDialog
				anggota={kartuAnggota}
				isOpen={isKartuDialogOpen}
				onOpenChange={setIsKartuDialogOpen}
			/>
		</div>
	);
}