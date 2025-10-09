"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAnggotaCrud } from "@/hooks/use-anggota-crud";
import { z } from "zod";
import { anggotaFormSchema } from "@/lib/schema";
import { Plus } from "lucide-react";
import { AnggotaForm } from "./anggota-form";
import { useState } from "react";

export function TambahAnggotaDialog() {
	const [open, setOpen] = useState(false);
	const { addAnggota, isAdding } = useAnggotaCrud();

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
		addAnggota({ data: formData, onSuccess: () => setOpen(false) });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					Tambah Anggota
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] md:max-w-[625px] h-[90vh] flex flex-col overflow-y-auto">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>Tambah Anggota</DialogTitle>
					<DialogDescription>
						Isi formulir di bawah ini untuk menambahkan anggota baru.
					</DialogDescription>
				</DialogHeader>
				<div className="flex-grow overflow-hidden overflow-y-auto">
					<AnggotaForm onSubmit={handleSubmit} isPending={isAdding} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
