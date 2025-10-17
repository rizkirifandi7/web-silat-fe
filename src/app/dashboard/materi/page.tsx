import React from "react";
import { getKategoriMateri } from "@/lib/kategori-materi-api";
import TambahKategoriMateriDialog from "@/components/tambah-kategori-materi-dialog";
import { KategoriMateriCard } from "@/components/kategori-materi-card";

const PageKategoriMateri = async () => {
	const kategoriMateri = await getKategoriMateri();
	console.log("Kategori Materi:", kategoriMateri);

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="rounded-xl bg-card text-card-foreground p-6 border">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
							Kategori Materi
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Kelola semua kategori materi yang tersedia untuk pembelajaran.
						</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<TambahKategoriMateriDialog />
					</div>
				</div>
				{kategoriMateri.length > 0 ? (
					<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{kategoriMateri.map((kategori) => (
							<KategoriMateriCard key={kategori.id} kategori={kategori} />
						))}
					</div>
				) : (
					<div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-muted py-12 text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-12 w-12 text-muted-foreground"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
						<h3 className="mt-4 text-lg font-medium">
							Belum ada kategori materi
						</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Mulai dengan menambahkan kategori materi baru.
						</p>
						<div className="mt-6">
							<TambahKategoriMateriDialog />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PageKategoriMateri;
