"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteKategoriMateri } from "@/lib/kategori-materi-api";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog";
import { Button } from "../ui/button";

interface DeleteKategoriMateriDialogProps {
	id: number;
}

export function DeleteKategoriMateriDialog({
	id,
}: DeleteKategoriMateriDialogProps) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const { mutate: removeKategori, isPending: isDeleting } = useMutation({
		mutationFn: deleteKategoriMateri,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kategoriMateri"] });
			toast.success("Kategori materi berhasil dihapus.");
			setOpen(false);
		},
		onError: (error) => {
			toast.error(error.message || "Gagal menghapus kategori materi.");
		},
	});

	return (
		<>
			<Button
				variant="outline"
				className="w-full text-center text-sm py-1 px-2 text-red-600 h-fit"
				onClick={() => setOpen(true)}
			>
				Hapus
			</Button>
			<DeleteDialog
				open={open}
				onOpenChange={setOpen}
				onConfirm={() => removeKategori(id)}
				isDeleting={isDeleting}
				itemName={`kategori materi ini`}
			/>
		</>
	);
}
