"use client";
import { use } from "react";
import { useMateriCRUD } from "@/hooks/use-materi-crud";
import { DataTableMateri } from "@/components/data-table/data-table-materi";
import { columns } from "@/components/data-table-colum/data-table-materi-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, FolderOpen, FileVideo, Info } from "lucide-react";
import Link from "next/link";

export default function DetailMateriPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { materi, isLoading, isError } = useMateriCRUD(id);

	if (isLoading) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="h-8 w-1/4 mb-4" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto py-10">
				<Alert variant="destructive">
					<AlertDescription>
						Gagal memuat data materi. Silakan refresh halaman atau kembali ke
						daftar kategori.
					</AlertDescription>
				</Alert>
				<div className="mt-4">
					<Link href="/dashboard/materi">
						<Button variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Kembali ke Kategori
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
			{/* Breadcrumb & Back Button */}
			<div className="mb-6">
				<Link href="/dashboard/materi">
					<Button variant="ghost" size="sm" className="mb-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Kembali ke Kategori
					</Button>
				</Link>

				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
					<FolderOpen className="h-4 w-4" />
					<span>Kategori Materi</span>
					<span>/</span>
					<span className="text-foreground font-medium">Detail Materi</span>
				</div>
			</div>

			{/* Info Banner */}
			<Alert className="mb-6 bg-blue-50 border-blue-200">
				<Info className="h-4 w-4 text-blue-600" />
				<AlertDescription className="text-blue-800">
					Kelola materi dalam kategori ini. Anda dapat menambah video
					pembelajaran, edit, atau hapus materi yang sudah ada.
				</AlertDescription>
			</Alert>

			{/* Header */}
			<div className="bg-card rounded-lg border p-6 mb-6">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-primary/10 rounded-lg">
						<FileVideo className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-2xl font-bold">Daftar Materi</h1>
				</div>
				<p className="text-muted-foreground">
					{materi && materi.length > 0
						? `Menampilkan ${materi.length} materi dalam kategori ini`
						: "Belum ada materi dalam kategori ini. Tambahkan materi pertama Anda."}
				</p>
			</div>

			{/* Data Table */}
			{materi && <DataTableMateri columns={columns} data={materi} />}
		</div>
	);
}

