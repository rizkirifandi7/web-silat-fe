"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
	IconCircleCheckFilled,
	IconDotsVertical,
	IconLoader,
} from "@tabler/icons-react";
import { Anggota } from "@/lib/schema";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type AnggotaTableHandlers = {
	onViewDetails: (anggota: Anggota) => void;
	onEdit: (anggota: Anggota) => void;
	onViewCard: (anggota: Anggota) => void;
	onDelete: (id: string) => void;
};

export const getAnggotaColumns = ({
	onViewDetails,
	onEdit,
	onViewCard,
	onDelete,
}: AnggotaTableHandlers): ColumnDef<Anggota>[] => [
	{
		accessorKey: "nama_lengkap",
		header: "Nama Lengkap",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("nama_lengkap")}</div>
		),
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "no_telepon",
		header: "No. Telepon",
	},
	{
		accessorKey: "tingkatan_sabuk",
		header: "Tingkatan",
		cell: ({ row }) => (
			<Badge variant="outline">{row.getValue("tingkatan_sabuk")}</Badge>
		),
	},
	{
		accessorKey: "status_keanggotaan",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant="outline" className="text-muted-foreground px-1.5">
				{row.original.status_keanggotaan === "Aktif" ? (
					<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
				) : (
					<IconLoader />
				)}
				{row.original.status_keanggotaan}
			</Badge>
		),
	},
	{
		accessorKey: "angkatan_unit",
		header: "Angkatan",
	},
	{
		accessorKey: "tanggal_lahir",
		header: "Tanggal Lahir",
		cell: ({ row }) => {
			const date = new Date(row.getValue("tanggal_lahir"));
			return date.toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			});
		},
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
					<DropdownMenuItem onClick={() => onViewDetails(row.original)}>
						Lihat Detail
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onEdit(row.original)}>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onViewCard(row.original)}>
						Lihat Kartu
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-red-600"
						onClick={() => onDelete(row.original.id)}
					>
						Hapus
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
