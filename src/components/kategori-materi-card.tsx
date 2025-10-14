"use client";

import { KategoriMateri } from "@/lib/schema";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GraduationCap, MoreVertical } from "lucide-react";
import { EditKategoriMateriDialog } from "./edit-kategori-materi-dialog";
import { DeleteKategoriMateriDialog } from "./delete-dialog/delete-kategori-materi-dialog";
import Link from "next/link";

interface KategoriMateriCardProps {
	kategori: KategoriMateri;
}

export function KategoriMateriCard({ kategori }: KategoriMateriCardProps) {
	return (
		<Card className="w-full overflow-hidden shadow-none">
			<div className="relative">
				<Link href={`/dashboard/materi/${kategori.id}`}>
					<div className="h-32 w-full bg-muted" />
				</Link>
				<div className="absolute top-2 right-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Aksi</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="space-y-1">
								<DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
									<EditKategoriMateriDialog kategori={kategori} />
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
									<DeleteKategoriMateriDialog id={kategori.id} />
								</DropdownMenuItem>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<CardContent className="py-2">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<GraduationCap className="h-4 w-4" />
					<span>Pencak Silat</span>
				</div>
				<Link href={`/dashboard/materi/${kategori.id}`}>
					<CardTitle className="mt-1 truncate hover:underline">
						{kategori.judul}
					</CardTitle>
				</Link>
			</CardContent>
		</Card>
	);
}
