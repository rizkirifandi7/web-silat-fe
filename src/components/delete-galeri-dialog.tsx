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
import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { useState } from "react";

interface DeleteGaleriDialogProps {
	galeriId: number;
	onSuccess: () => void;
	onCancel: () => void;
}

export function DeleteGaleriDialog({
	galeriId,
	onSuccess,
	onCancel,
}: DeleteGaleriDialogProps) {
	const { removeGaleri } = useGaleriCrud();
	const [open, setOpen] = useState(true);

	const handleDelete = async () => {
		await removeGaleri(galeriId);
		onSuccess();
		setOpen(false);
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			onCancel();
		}
		setOpen(isOpen);
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data galeri
						secara permanen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
