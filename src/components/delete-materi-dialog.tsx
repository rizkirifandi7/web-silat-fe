"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useMateriCRUD } from "@/hooks/use-materi-crud";
import { Materi } from "@/lib/schema";
import { useParams } from "next/navigation";

interface DeleteMateriDialogProps {
	materi: Materi;
}

export function DeleteMateriDialog({ materi }: DeleteMateriDialogProps) {
	const { id: id_course } = useParams();
	const { handleDelete, isDeleting } = useMateriCRUD(id_course as string);

	const onDelete = () => {
		handleDelete(materi.id);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="text-red-500">Hapus</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hapus Materi</DialogTitle>
					<DialogDescription>
						Apakah Anda yakin ingin menghapus materi &quot;{materi.judul}&quot;?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline">Batal</Button>
					<Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
						{isDeleting ? "Menghapus..." : "Hapus"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
