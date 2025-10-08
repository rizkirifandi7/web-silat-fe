"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteKategoriMateri } from "@/lib/kategori-materi-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteKategoriMateriDialogProps {
	id: number;
}

export function DeleteKategoriMateriDialog({
	id,
}: DeleteKategoriMateriDialogProps) {
	const router = useRouter();

	const handleDelete = async () => {
		try {
			await deleteKategoriMateri(id);
			toast.success("Kategori materi berhasil dihapus.");
			router.refresh();
		} catch (error) {
			const e = error as Error;
			toast.error(e.message || "Gagal menghapus kategori materi.");
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger className="w-full text-left text-sm py-1 px-2 text-red-600">
				Hapus
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kategori
						materi secara permanen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
