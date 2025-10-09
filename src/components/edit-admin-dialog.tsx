"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AdminForm, AdminFormValues } from "./admin-form";
import { useAdminCrud } from "@/hooks/use-admin-crud";
import { AdminData } from "@/lib/schema";
import { toast } from "sonner";

interface EditAdminDialogProps {
	admin: AdminData;
}

export function EditAdminDialog({ admin }: EditAdminDialogProps) {
	const [open, setOpen] = useState(false);
	const { editAdmin, isEditing } = useAdminCrud();

	const handleSubmit = (values: AdminFormValues) => {
		const dataToUpdate: Partial<AdminFormValues> = { ...values };

		// Hapus password dari data update jika tidak diisi
		if (!values.password) {
			delete dataToUpdate.password;
		}

		if (!admin.id) {
			console.error("Admin ID is missing!");
			toast.error("Gagal mengedit admin: ID tidak ditemukan.");
			return;
		}

		editAdmin(
			{ id: admin.id, data: dataToUpdate },
			{
				onSuccess: () => {
					setOpen(false);
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="h-fit p-0 text-center">
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Admin</DialogTitle>
				</DialogHeader>
				<AdminForm
					onSubmit={handleSubmit}
					isPending={isEditing}
					defaultValues={admin}
					isEdit={true}
				/>
			</DialogContent>
		</Dialog>
	);
}
