"use client";

import { ColumnDef } from "@tanstack/react-table";
import { KategoriMateri } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, FileVideo } from "lucide-react";
import { EditKategoriMateriDialog } from "@/components/edit-kategori-materi-dialog";
import { DeleteKategoriMateriDialog } from "@/components/delete-dialog/delete-kategori-materi-dialog";
import Link from "next/link";

interface KategoriMateriColumnsProps {
	onRefresh?: () => void;
	onMoveUp?: (id: number) => void;
	onMoveDown?: (id: number) => void;
	data?: KategoriMateri[];
}

export const getKategoriMateriColumns = ({
	onRefresh,
}: KategoriMateriColumnsProps): ColumnDef<KategoriMateri>[] => [
	{
		accessorKey: "urutan",
		header: "#",
		size: 50,
		cell: ({ row }) => {
			return (
				<div className="text-sm font-medium text-muted-foreground">
					{row.original.urutan || 0}
				</div>
			);
		},
	},
	{
		accessorKey: "judul",
		header: "Judul Kategori",
		cell: ({ row }) => {
			const kategori = row.original;
			return (
				<div>
					<Link
						href={`/dashboard/materi/${kategori.id}`}
						className="font-medium hover:text-primary hover:underline"
					>
						{kategori.judul}
					</Link>
					<p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
						{kategori.deskripsi || "Tidak ada deskripsi"}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "tingkatan_sabuk",
		header: "Tingkatan Sabuk",
		cell: ({ row }) => {
			const tingkatan = row.original.tingkatan_sabuk;
			if (!tingkatan || tingkatan === "null") {
				return (
					<Badge variant="outline" className="text-muted-foreground">
						Tidak Ada
					</Badge>
				);
			}

			// Define badge colors based on belt level
			const getBadgeColor = (sabuk: string) => {
				if (sabuk.includes("Putih")) return "bg-gray-100 text-gray-800";
				if (sabuk.includes("Kuning")) return "bg-yellow-100 text-yellow-800";
				if (sabuk.includes("Hijau")) return "bg-green-100 text-green-800";
				if (sabuk.includes("Merah")) return "bg-red-100 text-red-800";
				if (sabuk.includes("Hitam")) return "bg-gray-900 text-white";
				return "bg-blue-100 text-blue-800";
			};

			return <Badge className={getBadgeColor(tingkatan)}>{tingkatan}</Badge>;
		},
	},
	{
		accessorKey: "materialCount",
		header: "Jumlah Materi",
		cell: ({ row }) => {
			const materiCount = row.original.materialCount || 0;
			return (
				<div className="flex items-center gap-2">
					<FileVideo className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium">{materiCount}</span>
					{materiCount === 0 && (
						<Badge variant="secondary" className="ml-1">
							Kosong
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Dibuat",
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return (
				<div className="text-sm text-muted-foreground">
					{date.toLocaleDateString("id-ID", {
						day: "numeric",
						month: "short",
						year: "numeric",
					})}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const kategori = row.original;
			const materiCount = kategori.materialCount || 0;

			return (
				<div className="flex items-center gap-2 justify-end">
					<Link href={`/dashboard/materi/${kategori.id}`}>
						<Button variant="outline" size="sm">
							<Eye className="h-4 w-4 mr-1" />
							Lihat
						</Button>
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="space-y-1">
							<DropdownMenuLabel>Aksi</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
								<EditKategoriMateriDialog
									kategori={kategori}
									onSuccess={onRefresh}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
								<DeleteKategoriMateriDialog
									id={kategori.id}
									materiCount={materiCount}
									onSuccess={onRefresh}
								/>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];

