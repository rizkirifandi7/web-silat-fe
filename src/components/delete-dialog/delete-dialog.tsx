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

interface DeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
	itemName: string;
}

export function DeleteDialog({
	open,
	onOpenChange,
	onConfirm,
	isDeleting,
	itemName,
}: DeleteDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Tindakan ini tidak dapat diurungkan. Ini akan menghapus {itemName}{" "}
						secara permanen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? "Menghapus..." : "Hapus"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
