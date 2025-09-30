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
import { UbahPasswordDialog } from "./ubah-password-dialog";

export type AnggotaTableHandlers = {
	onViewDetails: (anggota: Anggota) => void;
	onEdit: (anggota: Anggota) => void;
	onViewCard: (anggota: Anggota) => void;
	onDelete: (anggota: Anggota) => void;
};

export const getAnggotaColumns = ({
	onViewDetails,
	onEdit,
	onViewCard,
	onDelete,
}: AnggotaTableHandlers): ColumnDef<Anggota>[] => [
	{
		id: "nama",
		accessorKey: "nama",
		header: "Nama Lengkap",
	},
	{
		id: "email",
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
					<UbahPasswordDialog>
						<div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
							Ubah Password
						</div>
					</UbahPasswordDialog>
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
