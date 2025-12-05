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

interface TambahKategoriMateriDialogProps {
	onSuccess?: () => void;
}

export default function TambahKategoriMateriDialog({
	onSuccess,
}: TambahKategoriMateriDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		setOpen(false);
		if (onSuccess) {
			onSuccess();
		}
	};

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
				<KategoriMateriForm onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}

