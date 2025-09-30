"use client";

import React from "react";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	SortingState,
	ColumnFiltersState,
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
import { useAnggotaCRUD } from "@/hooks/use-anggota-crud";
import { getAnggotaColumns } from "./data-table-anggota-columns";
import { DeleteAnggotaDialog } from "./delete-anggota-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAnggota } from "@/lib/anggota-api";
import { Plus } from "lucide-react";

export function DataTableAnggota({ data: initialData }: { data: Anggota[] }) {
	const queryClient = useQueryClient();

	const {
		data: anggotaData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["anggota"],
		queryFn: fetchAnggota,
		initialData: initialData,
	});

	const handleSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["anggota"] });
	};

	const { dialog, actions, handleAdd, handleDelete } = useAnggotaCRUD(
		anggotaData,
		handleSuccess
	);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] = React.useState({});

	const columns = React.useMemo(
		() =>
			getAnggotaColumns({
				onViewDetails: actions.openView,
				onEdit: actions.openEdit,
				onViewCard: actions.openCard,
				onDelete: actions.openDelete,
			}),
		[actions]
	);

	const table = useReactTable({
		data: anggotaData,
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error fetching data</div>;
	}

	return (
		<div className="w-full">
			<div className="flex flex-col md:flex-row items-center py-4">
				<Input
					placeholder="Cari berdasarkan nama..."
					value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("nama")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="ml-auto flex items-center gap-2 w-full py-2 md:w-auto md:py-0">
					<Button onClick={actions.openAdd}><Plus/>Tambah Anggota</Button>
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

			{/* Dialogs and Drawers */}
			<TambahAnggotaDialog
				isOpen={dialog?.type === "add"}
				onOpenChange={actions.close}
				onAnggotaAdded={handleAdd}
			/>

			<EditAnggotaDialog
				anggota={dialog?.type === "edit" ? dialog.anggota : null}
				isOpen={dialog?.type === "edit"}
				onOpenChange={actions.close}
				onSuccess={handleSuccess}
			/>

			<DetailAnggotaDrawer
				anggota={dialog?.type === "view" ? dialog.anggota : null}
				isOpen={dialog?.type === "view"}
				onOpenChange={actions.close}
			/>

			<KartuAnggotaDialog
				anggota={dialog?.type === "card" ? dialog.anggota : null}
				isOpen={dialog?.type === "card"}
				onOpenChange={actions.close}
			/>

			<DeleteAnggotaDialog
				anggota={dialog?.type === "delete" ? dialog.anggota : null}
				isOpen={dialog?.type === "delete"}
				onOpenChange={actions.close}
				onConfirm={() => {
					if (dialog?.type === "delete") {
						handleDelete(dialog.anggota.id);
					}
				}}
			/>
		</div>
	);
}
