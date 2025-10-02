"use client";

import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";

type GalleryItem = {
	id: number;
	gambar: string;
	judul: string;
	deskripsi: string;
};

type GaleriGridProps = {
	galleryData: GalleryItem[];
};

export function GaleriGrid({ galleryData }: GaleriGridProps) {
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
		<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{galleryData.map((item) => (
				<Card
					key={item.id}
					className="overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 p-4 shadow-none"
				>
					<CardContent className="p-0 relative h-64">
						<Image
							src={item.gambar}
							alt={item.judul}
							fill
							className="object-cover rounded-md border"
						/>
					</CardContent>
					<div>
						<CardTitle className="text-lg font-semibold">
							{item.judul}
						</CardTitle>
						<CardDescription className="mt-1 text-sm truncate">
							{item.deskripsi}
						</CardDescription>
					</div>
				</Card>
			))}
		</div>
	);
}
