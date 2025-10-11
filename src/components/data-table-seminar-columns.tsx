"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Seminar } from "@/types/seminar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns = (
	onEdit: (seminar: Seminar) => void,
	onDelete: (seminar: Seminar) => void
): ColumnDef<Seminar>[] => [
	{
		accessorKey: "judul",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Judul
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "tanggal_mulai",
		header: "Tanggal Mulai",
		cell: ({ row }) =>
			format(new Date(row.original.tanggal_mulai), "dd MMM yyyy"),
	},
	{
		accessorKey: "lokasi",
		header: "Lokasi",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			let variant: "default" | "secondary" | "destructive" | "outline" =
				"secondary";
			if (status === "Akan Datang") variant = "default";
			if (status === "Berlangsung") variant = "outline";
			if (status === "Selesai") variant = "destructive";

			return <Badge variant={variant}>{status}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const seminar = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Buka menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Aksi</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => onEdit(seminar)}>
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onDelete(seminar)}>
							Hapus
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
