"use client";

import { useAnggotaCrud } from "@/hooks/use-anggota-crud";
import { Anggota } from "@/lib/schema";
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog";

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
		removeAnggota(anggota.id, {
			onSuccess: () => onOpenChange(false),
		});
	};

	return (
		<DeleteDialog
			open={open}
			onOpenChange={onOpenChange}
			onConfirm={handleConfirm}
			isDeleting={isDeleting}
			itemName={anggota.nama}
		/>
	);
}
