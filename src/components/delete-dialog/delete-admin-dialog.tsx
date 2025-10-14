"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminCrud } from "@/hooks/use-admin-crud";
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog";

interface DeleteAdminDialogProps {
	adminId: number;
}

export function DeleteAdminDialog({ adminId }: DeleteAdminDialogProps) {
	const { removeAdmin, isDeleting } = useAdminCrud();
	const [open, setOpen] = useState(false);

	const handleDelete = () => {
		removeAdmin(adminId, {
			onSuccess: () => setOpen(false),
		});
	};

	return (
		<>
			<Button
				variant="ghost"
				className="text-red-500 h-fit p-0 text-center"
				onClick={() => setOpen(true)}
			>
				Hapus
			</Button>
			<DeleteDialog
				open={open}
				onOpenChange={setOpen}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
				itemName="admin"
			/>
		</>
	);
}
