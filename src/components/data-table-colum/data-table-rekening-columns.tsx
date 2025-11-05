"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Rekening } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

export type RekeningTableHandlers = {
	onEdit: (rekening: Rekening) => void;
	onDelete: (rekening: Rekening) => void;
};

export const getRekeningColumns = ({
	onEdit,
	onDelete,
}: RekeningTableHandlers): ColumnDef<Rekening>[] => [
	{
		accessorKey: "logo",
		header: "Logo",
		cell: ({ row }) => (
			<Image
				src={row.original.logo || "/no-image.jpg"}
				alt={row.original.namaBank}
				width={80}
				height={80}
				priority
				className="rounded-md"
			/>
		),
	},
	{
		accessorKey: "namaBank",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nama Bank
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("namaBank")}</div>
		),
	},
	{
		accessorKey: "namaPemilik",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nama Pemlik
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("namaPemilik")}</div>
		),
	},
	{
		accessorKey: "noRekening",
		header: "Nomor Rekening",
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("noRekening")}</div>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<IconDotsVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => onEdit(row.original)}>
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-red-600"
						onClick={() => onDelete(row.original)}
					>
						Hapus
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
