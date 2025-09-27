"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { GaleriForm } from "@/components/galeri-form";
import { useState } from "react";
import { Plus } from "lucide-react";

export function TambahGaleriDialog({ onSuccess }: { onSuccess: () => void }) {
	const [open, setOpen] = useState(false);
	const { addGaleri } = useGaleriCrud();

	const handleSuccess = () => {
		onSuccess();
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					Tambah Galeri
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tambah Galeri</DialogTitle>
				</DialogHeader>
				<GaleriForm onSubmit={addGaleri} onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
