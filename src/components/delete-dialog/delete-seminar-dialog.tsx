"use client";

import { useState } from "react";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { DeleteDialog } from "./delete-dialog";
import { Seminar } from "@/lib/schema";

interface DeleteSeminarDialogProps {
	seminar: Seminar;
	children: React.ReactNode;
	onDelete?: () => void;
}

export function DeleteSeminarDialog({
	seminar,
	children,
	onDelete,
}: DeleteSeminarDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { removeSeminar, isDeleting } = useSeminarCrud();

	const handleDelete = () => {
		removeSeminar(seminar.id, {
			onSuccess: () => {
				setIsOpen(false);
				if (onDelete) {
					onDelete();
				}
			},
		});
	};

	return (
		<>
			<div
				className="w-full"
				onClick={(e) => {
					e.preventDefault();
					setIsOpen(true);
				}}
			>
				{children}
			</div>
			<DeleteDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
				itemName={`seminar "${seminar.judul}"`}
			/>
		</>
	);
}
