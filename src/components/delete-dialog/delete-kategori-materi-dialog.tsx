"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteKategoriMateri } from "@/lib/kategori-materi-api";
import { toast } from "sonner";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "../ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteKategoriMateriDialogProps {
	id: number;
	materiCount?: number;
	onSuccess?: () => void;
}

export function DeleteKategoriMateriDialog({
	id,
	materiCount = 0,
	onSuccess,
}: DeleteKategoriMateriDialogProps) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const { mutate: removeKategori, isPending: isDeleting } = useMutation({
		mutationFn: deleteKategoriMateri,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kategoriMateri"] });
			toast.success("Kategori materi dan semua materinya berhasil dihapus.");
			setOpen(false);
			if (onSuccess) {
				onSuccess();
			}
		},
		onError: (error) => {
			toast.error(error.message || "Gagal menghapus kategori materi.");
		},
	});

	return (
		<>
			<Button
				variant="outline"
				className="w-full text-center text-sm py-1 px-2 text-red-600 h-fit hover:bg-red-50"
				onClick={() => setOpen(true)}
			>
				<Trash2 className="h-3.5 w-3.5 mr-1" />
				Hapus
			</Button>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-red-600" />
							Hapus Kategori Materi?
						</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-3">
								<div className="text-sm text-muted-foreground">
									Anda akan menghapus kategori materi ini secara permanen.
								</div>

								{materiCount > 0 && (
									<Alert
										variant="destructive"
										className="border-red-200 bg-red-50"
									>
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription className="font-semibold">
											Peringatan: Kategori ini berisi{" "}
											<span className="font-bold">{materiCount} materi</span>.
											<br />
											Semua materi di dalamnya akan ikut terhapus!
										</AlertDescription>
									</Alert>
								)}

								<div className="text-sm text-muted-foreground">
									{materiCount > 0
										? "Pastikan Anda sudah backup data jika diperlukan. Tindakan ini tidak dapat dibatalkan."
										: "Tindakan ini tidak dapat dibatalkan."}
								</div>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => removeKategori(id)}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
						>
							{isDeleting ? "Menghapus..." : "Ya, Hapus"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

