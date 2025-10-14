"use client";

import { DeleteDialog } from "./delete-dialog";

interface DeleteSeminarDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
	seminarTitle: string;
}

export function DeleteSeminarDialog({
	isOpen,
	onOpenChange,
	onConfirm,
	isDeleting,
	seminarTitle,
}: DeleteSeminarDialogProps) {
	return (
		<DeleteDialog
			open={isOpen}
			onOpenChange={onOpenChange}
			onConfirm={onConfirm}
			isDeleting={isDeleting}
			itemName={`seminar "${seminarTitle}"`}
		/>
	);
}
