"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAnggotaCrud } from "@/hooks/use-anggota-crud";
import { z } from "zod";
import { Anggota, anggotaFormSchema } from "@/lib/schema";
import { AnggotaForm } from "./anggota-form";

interface EditAnggotaDialogProps {
	anggota: Anggota;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditAnggotaDialog({
	anggota,
	open,
	onOpenChange,
}: EditAnggotaDialogProps) {
	const { editAnggota, isEditing } = useAnggotaCrud();

	const handleSubmit = (values: z.infer<typeof anggotaFormSchema>) => {
		const formData = new FormData();
		Object.keys(values).forEach((key) => {
			const value = values[key as keyof typeof values];
			if (value instanceof File) {
				formData.append(key, value, value.name);
			} else if (value !== undefined && value !== null) {
				formData.append(key, String(value));
			}
		});
		editAnggota({
			id: anggota.id,
			data: formData,
			onSuccess: () => onOpenChange(false),
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] md:max-w-[625px] h-[90vh] flex flex-col overflow-y-auto">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>Ubah Anggota</DialogTitle>
					<DialogDescription>
						Ubah informasi anggota di bawah ini.
					</DialogDescription>
				</DialogHeader>
				<div className="flex-grow overflow-hidden overflow-y-auto">
					<AnggotaForm
						defaultValues={anggota}
						onSubmit={handleSubmit}
						isPending={isEditing}
						isEdit={true}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
