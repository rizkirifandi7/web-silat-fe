"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { KategoriMateri } from "@/lib/schema";
import KategoriMateriForm from "./kategori-materi-bulk-form";

interface EditKategoriMateriDialogProps {
	kategori: KategoriMateri;
}

export function EditKategoriMateriDialog({
	kategori,
}: EditKategoriMateriDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="w-full text-center text-sm py-1 px-2 hover:bg-accent rounded-md border">
				Ubah
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Ubah Kategori Materi</DialogTitle>
					<DialogDescription>
						Ubah detail kategori materi di bawah ini.
					</DialogDescription>
				</DialogHeader>
				<KategoriMateriForm
					kategori={kategori}
					onSuccess={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
