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
import { Plus } from "lucide-react";

export function TambahAdminDialog() {
	const [open, setOpen] = useState(false);
	const { addAdmin, isAdding } = useAdminCrud();

	const handleSubmit = (values: AdminFormValues) => {
		// Pastikan values sesuai dengan CreateAdminData
		const adminData = {
			...values,
			password: values.password || "", // Pastikan password tidak undefined
		};

		addAdmin(adminData, {
			onSuccess: () => {
				setOpen(false);
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Admin
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tambah Admin Baru</DialogTitle>
				</DialogHeader>
				<AdminForm onSubmit={handleSubmit} isPending={isAdding} />
			</DialogContent>
		</Dialog>
	);
}
