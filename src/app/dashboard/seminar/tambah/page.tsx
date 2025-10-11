"use client";

import { SeminarForm } from "@/components/seminar-form";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function TambahSeminarPageContent() {
	const { form, onSubmit, isSubmitting } = useSeminarCrud();

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">
					Tambah Seminar Baru
				</h2>
			</div>
			<SeminarForm
				form={form}
				onSubmit={onSubmit}
				isSubmitting={isSubmitting}
				submitText="Simpan"
			/>
		</div>
	);
}

export default function TambahSeminarPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<TambahSeminarPageContent />
		</QueryClientProvider>
	);
}
