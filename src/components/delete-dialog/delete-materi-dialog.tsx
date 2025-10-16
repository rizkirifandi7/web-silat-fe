"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMateriCRUD } from "@/hooks/use-materi-crud";
import { Materi } from "@/lib/types";
import { useParams } from "next/navigation";
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog";

interface DeleteMateriDialogProps {
	materi: Materi;
}

export function DeleteMateriDialog({ materi }: DeleteMateriDialogProps) {
	const { id: id_course } = useParams();
	const { handleDelete, isDeleting } = useMateriCRUD(id_course as string);
	const [open, setOpen] = useState(false);

	const onDelete = () => {
		handleDelete(materi.id, {
			onSuccess: () => setOpen(false),
		});
	};

	return (
		<>
			<Button
				variant="outline"
				className="text-red-500"
				onClick={() => setOpen(true)}
			>
				Hapus
			</Button>
			<DeleteDialog
				open={open}
				onOpenChange={setOpen}
				onConfirm={onDelete}
				isDeleting={isDeleting}
				itemName={`materi "${materi.judul}"`}
			/>
		</>
	);
}
