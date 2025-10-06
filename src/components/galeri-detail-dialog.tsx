"use client";

import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

type GalleryItem = {
	id: number;
	gambar: string;
	judul: string;
	deskripsi: string;
};

interface GaleriDetailDialogProps {
	galeri: GalleryItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function GaleriDetailDialog({
	galeri,
	open,
	onOpenChange,
}: GaleriDetailDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						{galeri.judul}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="relative w-full h-64 rounded-lg overflow-hidden">
						<Image
							src={galeri.gambar}
							alt={galeri.judul}
							fill
							className="object-contain"
							sizes=""
						/>
					</div>
					{galeri.deskripsi && (
						<DialogDescription className="text-base leading-relaxed">
							{galeri.deskripsi}
						</DialogDescription>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}


