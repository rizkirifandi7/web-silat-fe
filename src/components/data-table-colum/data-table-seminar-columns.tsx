"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Seminar } from "@/lib/schema";
import Link from "next/link";
import { DeleteSeminarDialog } from "../delete-dialog/delete-seminar-dialog";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Seminar>[] = [
	{
		accessorKey: "judul",
		header: "Judul",
	},
	{
		accessorKey: "lokasi",
		header: "Lokasi",
	},
	{
		accessorKey: "harga",
		header: "Harga",
		cell: ({ row }) => {
			const harga = parseFloat(row.getValue("harga"));
			const formatted = new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0,
			}).format(harga);

			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "kuota",
		header: "Kuota",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<Badge
					variant={
						status === "Akan Datang"
							? "secondary"
							: status === "Berlangsung"
							? "default"
							: "destructive"
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "tanggal_mulai",
		header: "Tanggal Mulai",
		cell: ({ row }) => {
			const date = new Date(row.original.tanggal_mulai);
			return date.toLocaleDateString("id-ID", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const id = row.original.id;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<IconDotsVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Link href={`/dashboard/seminar/edit/${id}`}>
							<DropdownMenuItem>Edit</DropdownMenuItem>
						</Link>
						<Link href={`/dashboard/seminar/detail/${id}`}>
							<DropdownMenuItem>Detail</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
						<DeleteSeminarDialog seminar={row.original}>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								Delete
							</DropdownMenuItem>
						</DeleteSeminarDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
