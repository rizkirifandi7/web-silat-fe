"use client";

import React, { useEffect, useState } from "react";
import {
	getKategoriMateri,
	updateKategoriMateriOrder,
} from "@/lib/kategori-materi-api";
import { KategoriMateri } from "@/lib/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Info, FolderPlus, FileText, CheckCircle2 } from "lucide-react";
import { DataTableKategoriMateri } from "@/components/data-table/data-table-kategori-materi-dnd";
import { getKategoriMateriColumns } from "@/components/data-table-colum/data-table-kategori-materi-columns";
import { toast } from "sonner";

const PageKategoriMateri = () => {
	const [kategoriMateri, setKategoriMateri] = useState<KategoriMateri[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const data = await getKategoriMateri();
			setKategoriMateri(data);
		} catch (error) {
			console.error("Failed to fetch kategori materi:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReorder = async (newData: KategoriMateri[]) => {
		// Update urutan values based on new position
		const orders = newData.map((item, idx) => ({
			id: item.id,
			urutan: idx + 1,
		}));

		try {
			await updateKategoriMateriOrder(orders);
			toast.success("Urutan kategori berhasil diubah");
			// Update local state with new urutan values
			setKategoriMateri(
				newData.map((item, idx) => ({ ...item, urutan: idx + 1 }))
			);
		} catch (error) {
			console.error("Error updating order:", error);
			toast.error("Gagal mengubah urutan kategori");
			fetchData(); // Rollback
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			{/* Welcome Banner */}

			<div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Manajemen Kategori Materi Pembelajaran
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Kelola kategori dan materi pembelajaran pencak silat. Setiap
						kategori berisi kumpulan materi terkait.
					</p>
				</div>
			</div>

			<Alert className="mb-6 bg-blue-50 border-blue-200">
				<Info className="h-4 w-4 text-blue-600" />
				<AlertTitle className="text-blue-900">Cara Mengelola Materi</AlertTitle>
				<AlertDescription className="text-blue-800">
					<ol className="list-decimal list-inside space-y-1 mt-2">
						<li>
							<strong>Buat Kategori</strong> - Tambahkan kategori untuk
							mengelompokkan materi (contoh: Teknik Dasar, Jurus, dll)
						</li>
						<li>
							<strong>Tambah Materi</strong> - Klik kategori, lalu tambahkan
							materi video/dokumen ke dalamnya
						</li>
						<li>
							<strong>Kelola Konten</strong> - Edit, hapus, atau atur urutan
							materi sesuai kebutuhan
						</li>
					</ol>
				</AlertDescription>
			</Alert>

			{/* Stats Card - Terpisah dari Tabel */}
			{!isLoading && kategoriMateri.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="shadow-sm rounded-b-md">
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Total Kategori</p>
									<p className="text-2xl font-bold">{kategoriMateri.length}</p>
								</div>
								<FolderPlus className="h-6 w-6 text-blue-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-sm rounded-b-md">
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Total Materi</p>
									<p className="text-2xl font-bold">
										{kategoriMateri.reduce(
											(acc, k) => acc + (k.materialCount || 0),
											0
										)}
									</p>
								</div>
								<FileText className="h-6 w-6 text-green-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-sm rounded-b-md">
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Rata-rata per Kategori</p>
									<p className="text-2xl font-bold">
										{Math.round(
											kategoriMateri.reduce(
												(acc, k) => acc + (k.materialCount || 0),
												0
											) / kategoriMateri.length
										) || 0}
									</p>
								</div>
								<CheckCircle2 className="h-6 w-6 text-purple-400" />
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Tabel Kategori Materi */}
			<div className="rounded-xl bg-card text-card-foreground p-6 border">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center rounded-lg bg-muted py-12 text-center">
						<p className="text-lg font-medium">Memuat data...</p>
					</div>
				) : kategoriMateri.length > 0 ? (
					<DataTableKategoriMateri
						columns={getKategoriMateriColumns({
							onRefresh: fetchData,
							data: kategoriMateri,
						})}
						data={kategoriMateri}
						onRefresh={fetchData}
						onReorder={handleReorder}
					/>
				) : (
					<div>
						{/* Empty State dengan Tutorial */}
						<div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 py-12 px-6 text-center border-2 border-dashed">
							<div className="rounded-full bg-primary/10 p-4 mb-4">
								<FolderPlus className="h-12 w-12 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Belum Ada Kategori Materi
							</h3>
							<p className="text-muted-foreground max-w-md mb-8">
								Mulai dengan membuat kategori untuk mengelompokkan materi
								pembelajaran. Setelah kategori dibuat, Anda bisa menambahkan
								materi ke dalamnya.
							</p>

							{/* Tutorial Steps */}
							<div className="grid gap-4 md:grid-cols-3 max-w-4xl mb-8 text-left">
								<Card className="border-primary/20">
									<CardContent>
										<div className="flex items-start gap-3">
											<div className="rounded-full bg-blue-100 p-2 mt-1">
												<span className="text-blue-600 font-bold text-sm">
													1
												</span>
											</div>
											<div>
												<h4 className="font-semibold mb-1 flex items-center gap-2">
													<FolderPlus className="h-4 w-4" />
													Buat Kategori
												</h4>
												<p className="text-sm text-muted-foreground">
													Klik tombol &ldquo;Tambah Kategori&rdquo; untuk
													membuat kategori baru seperti &ldquo;Teknik
													Dasar&rdquo; atau &ldquo;Jurus&rdquo;.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-primary/20">
									<CardContent>
										<div className="flex items-start gap-3">
											<div className="rounded-full bg-green-100 p-2 mt-1">
												<span className="text-green-600 font-bold text-sm">
													2
												</span>
											</div>
											<div>
												<h4 className="font-semibold mb-1 flex items-center gap-2">
													<FileText className="h-4 w-4" />
													Tambah Materi
												</h4>
												<p className="text-sm text-muted-foreground">
													Klik kategori yang sudah dibuat, lalu tambahkan materi
													video atau dokumen ke dalamnya.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-primary/20">
									<CardContent>
										<div className="flex items-start gap-3">
											<div className="rounded-full bg-purple-100 p-2 mt-1">
												<span className="text-purple-600 font-bold text-sm">
													3
												</span>
											</div>
											<div>
												<h4 className="font-semibold mb-1 flex items-center gap-2">
													<CheckCircle2 className="h-4 w-4" />
													Kelola Konten
												</h4>
												<p className="text-sm text-muted-foreground">
													Atur, edit, atau hapus materi sesuai kebutuhan
													pembelajaran Anda.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PageKategoriMateri;

