"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import KategoriMateriForm from "./kategori-materi-bulk-form";

export default function TambahKategoriMateriDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Kategori
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tambah Kategori Materi</DialogTitle>
					<DialogDescription>
						Isi formulir di bawah ini untuk menambahkan kategori materi baru.
					</DialogDescription>
				</DialogHeader>
				<KategoriMateriForm onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
