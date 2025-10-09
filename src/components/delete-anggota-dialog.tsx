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
} from "@/components/ui/alert-dialog";
import { useAnggotaCrud } from "@/hooks/use-anggota-crud";
import { Anggota } from "@/lib/schema";

interface DeleteAnggotaDialogProps {
	anggota: Anggota;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteAnggotaDialog({
	anggota,
	open,
	onOpenChange,
}: DeleteAnggotaDialogProps) {
	const { removeAnggota, isDeleting } = useAnggotaCrud();

	const handleConfirm = () => {
		removeAnggota(anggota.id);
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Tindakan ini tidak dapat dibatalkan. Ini akan menghapus anggota
						<strong>{anggota?.nama}</strong> secara permanen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
						{isDeleting ? "Menghapus..." : "Hapus"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
