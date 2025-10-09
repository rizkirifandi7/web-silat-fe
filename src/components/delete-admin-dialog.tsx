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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAdminCrud } from "@/hooks/use-admin-crud";

interface DeleteAdminDialogProps {
	adminId: number;
}

export function DeleteAdminDialog({ adminId }: DeleteAdminDialogProps) {
	const { removeAdmin, isDeleting } = useAdminCrud();

	const handleDelete = () => {
		removeAdmin(adminId);
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" className="text-red-500 h-fit p-0 text-center">
					Hapus
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Tindakan ini tidak dapat dibatalkan. Ini akan menghapus admin secara
						permanen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
						{isDeleting ? "Menghapus..." : "Hapus"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
