"use client";

import { ColumnDef } from "@tanstack/react-table";
import { KategoriMateri } from "@/lib/schema";
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
import { EditKategoriMateriDialog } from "./edit-kategori-materi-dialog";
import { DeleteKategoriMateriDialog } from "./delete-kategori-materi-dialog";

export const columns: ColumnDef<KategoriMateri>[] = [
	{
		accessorKey: "judul",
		header: "Judul",
	},
	{
		accessorKey: "deskripsi",
		header: "Deskripsi",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const kategori = row.original;

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
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<EditKategoriMateriDialog kategori={kategori} />
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<DeleteKategoriMateriDialog id={kategori.id} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
