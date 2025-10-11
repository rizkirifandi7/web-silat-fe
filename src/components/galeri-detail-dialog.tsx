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
	if (!galeri) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm md:max-w-2xl lg:max-w-4xl p-0">
				<div className="flex flex-col md:grid md:grid-cols-2 max-h-[90vh] p-2">
					<div className="relative w-full h-64 md:h-auto md:min-h-[400px]">
						<Image
							src={galeri.gambar}
							alt={galeri.judul}
							fill
							className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
						/>
					</div>
					<div className="p-4 sm:p-6 flex flex-col overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-xl md:text-2xl font-bold tracking-tight mb-2">
								{galeri.judul}
							</DialogTitle>
						</DialogHeader>
						{galeri.deskripsi && (
							<div className="flex-1">
								<DialogDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
									{galeri.deskripsi}
								</DialogDescription>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
