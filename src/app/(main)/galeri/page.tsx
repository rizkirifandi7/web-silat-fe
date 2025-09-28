"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type GalleryItem = {
	id: number;
	gambar: string;
	judul: string;
	deskripsi: string;
};

export default function GaleriPage() {
	const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		const fetchGalleryData = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/galeri`
				);
				if (!response.ok) {
					throw new Error(
						"Gagal mengambil data galeri. Pastikan API server berjalan."
					);
				}
				const data = await response.json();
				setGalleryData(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Terjadi kesalahan yang tidak diketahui");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchGalleryData();
	}, []);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p className="text-lg">Memuat galeri...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 text-center text-red-500">
				<p className="text-lg font-semibold">Gagal Memuat Galeri</p>
				<p className="text-sm">{error}</p>
			</div>
		);
	}

	if (galleryData.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p className="text-lg text-muted-foreground">
					Tidak ada gambar di galeri saat ini.
				</p>
			</div>
		);
	}

	return (
		<section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
			<div className="container max-w-5xl mx-auto px-4 md:px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Galeri Kegiatan
						</h1>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Momen-momen terbaik dari kegiatan kami, tertangkap dalam gambar.
						</p>
					</div>
				</div>
				<div className="mt-12 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
					{galleryData.map((item, index) => (
						<div
							key={item.id}
							className={`relative group overflow-hidden rounded-lg transform transition-all duration-500 ease-in-out break-inside-avoid ${
								isMounted
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-10"
							}`}
							style={{
								transitionDelay: `${index * 50}ms`,
							}}
						>
							<Image
								src={item.gambar}
								alt={item.judul}
								width={500}
								height={500}
								className="h-auto w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
