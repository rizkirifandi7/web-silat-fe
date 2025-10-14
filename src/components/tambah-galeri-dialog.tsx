"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GaleriForm } from "@/components/galeri-form";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useGaleriCrud } from "@/hooks/use-galeri-crud";

export function TambahGaleriDialog() {
	const [open, setOpen] = useState(false);
	const { addGaleriAsync } = useGaleriCrud();

	const handleSuccess = () => {
		setOpen(false);
	};

	const handleSubmit = async (formData: FormData) => {
		await addGaleriAsync(formData);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					<span>Tambah Galeri</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tambah Galeri</DialogTitle>
				</DialogHeader>
				<GaleriForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
			</DialogContent>
		</Dialog>
	);
}
