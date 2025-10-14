"use client";

import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog";

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
	const { removeGaleri, isDeleting } = useGaleriCrud();

	const handleDelete = async () => {
		try {
			await removeGaleri(galeriId);
			onSuccess();
		} catch (error) {
			// Error handling is done in the hook
			console.error(error);
		}
	};

	return (
		<DeleteDialog
			open={true}
			onOpenChange={(open) => !open && onCancel()}
			onConfirm={handleDelete}
			isDeleting={isDeleting}
			itemName="galeri"
		/>
	);
}
