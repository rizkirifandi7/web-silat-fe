"use client";

import { KategoriMateri } from "@/lib/schema";
import {
	Card,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	GraduationCap,
	MoreVertical,
	FileVideo,
	Play,
	BookOpen,
	ArrowRight,
} from "lucide-react";
import { EditKategoriMateriDialog } from "./edit-kategori-materi-dialog";
import { DeleteKategoriMateriDialog } from "./delete-dialog/delete-kategori-materi-dialog";
import Link from "next/link";

interface KategoriMateriCardProps {
	kategori: KategoriMateri;
	onRefresh?: () => void;
}

export function KategoriMateriCard({
	kategori,
	onRefresh,
}: KategoriMateriCardProps) {
	// @ts-ignore - materiCount comes from backend
	const materiCount = kategori.materiCount || 0;

	return (
		<Card className="w-full overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20">
			<div className="relative overflow-hidden">
				<Link href={`/dashboard/materi/${kategori.id}`}>
					<div className="h-40 w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300 relative">
						{/* Decorative background pattern */}
						<div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

						<div className="relative z-10 flex flex-col items-center">
							<div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-2 group-hover:bg-white/20 transition-colors">
								<BookOpen className="h-12 w-12 text-white" />
							</div>
							{materiCount > 0 && (
								<Badge className="bg-white/90 text-primary hover:bg-white font-semibold">
									{materiCount} Materi
								</Badge>
							)}
						</div>
					</div>
				</Link>

				{/* Action Menu */}
				<div className="absolute top-3 right-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="h-8 w-8 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuLabel>Kelola Kategori</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="space-y-1">
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
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Empty state badge */}
				{materiCount === 0 && (
					<div className="absolute top-3 left-3">
						<Badge
							variant="secondary"
							className="bg-yellow-100 text-yellow-800 border-yellow-300"
						>
							Kosong
						</Badge>
					</div>
				)}
			</div>

			<CardContent className="p-5">
				<Link
					href={`/dashboard/materi/${kategori.id}`}
					className="block group/link"
				>
					<CardTitle className="mb-2 text-lg line-clamp-2 group-hover/link:text-primary transition-colors">
						{kategori.judul}
					</CardTitle>
					<CardDescription className="text-sm line-clamp-2 mb-4">
						{kategori.deskripsi || "Kumpulan materi pembelajaran pencak silat"}
					</CardDescription>
				</Link>

				{/* Footer Info */}
				<div className="flex items-center justify-between pt-3 border-t">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<FileVideo className="h-3.5 w-3.5" />
						<span>
							{materiCount === 0
								? "Belum ada materi"
								: `${materiCount} materi tersedia`}
						</span>
					</div>
					<Link href={`/dashboard/materi/${kategori.id}`}>
						<Button variant="ghost" size="sm" className="h-8 text-xs group/btn">
							<span className="group-hover/btn:mr-1 transition-all">Buka</span>
							<ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-1 transition-all" />
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}

