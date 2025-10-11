"use client";

import { SeminarForm } from "@/components/seminar-form";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSeminars } from "@/lib/seminar-api"; // Assuming you have a function to get a single seminar

const queryClient = new QueryClient();

function EditSeminarPageContent() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const { form, onUpdate, isUpdating, setSelectedSeminar, selectedSeminar } =
		useSeminarCrud();

	useEffect(() => {
		if (id) {
			// Fetch all seminars and find the one with the matching id
			// This is not optimal, a dedicated getSeminarById(id) would be better
			getSeminars().then((seminars) => {
				const seminarToEdit = seminars.find((s) => s.id === id);
				if (seminarToEdit) {
					setSelectedSeminar(seminarToEdit);
					form.reset({
						...seminarToEdit,
						tanggal_mulai: new Date(seminarToEdit.tanggal_mulai),
						tanggal_selesai: new Date(seminarToEdit.tanggal_selesai),
					});
				} else {
					// Handle case where seminar is not found
					router.push("/dashboard/seminar");
				}
			});
		}
	}, [id, setSelectedSeminar, form, router]);

	if (!selectedSeminar) {
		return <div>Memuat data seminar...</div>;
	}

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Edit Seminar</h2>
			</div>
			<SeminarForm
				form={form}
				onSubmit={onUpdate}
				isSubmitting={isUpdating}
				submitText="Simpan Perubahan"
			/>
		</div>
	);
}

export default function EditSeminarPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<EditSeminarPageContent />
		</QueryClientProvider>
	);
}
