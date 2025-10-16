"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Materi } from "@/lib/types";
import { EditMateriDialog } from "@/components/edit-materi-dialog";
import { DeleteMateriDialog } from "@/components/delete-dialog/delete-materi-dialog";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Materi>[] = [
	{
		accessorKey: "judul",
		header: "Judul",
	},
	{
		accessorKey: "tipeKonten",
		header: "Tipe Konten",
	},
	{
		accessorKey: "konten",
		header: "Konten",
		cell: ({ row }) => {
			const { tipeKonten, konten } = row.original;
			if (tipeKonten === "video") {
				return (
					<a href={konten || "#"} target="_blank" rel="noopener noreferrer">
						Link Video
					</a>
				);
			}
			return (
				<a href={konten || "#"} target="_blank" rel="noopener noreferrer">
					Link PDF
				</a>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const materi = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<div className="flex flex-col gap-1">
							<DropdownMenuItem asChild>
								<EditMateriDialog materi={materi} />
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<DeleteMateriDialog materi={materi} />
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
