"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataTableAdmin } from "@/components/data-table/data-table-admin";
import { useAdminCrud } from "@/hooks/use-admin-crud";
import { columns } from "@/components/data-table-colum/data-table-admin-columns";

const queryClient = new QueryClient();

function AdminPageContent() {
	const { admins, isLoadingAdmins, isErrorAdmins } = useAdminCrud();

	if (isLoadingAdmins) {
		return <div>Loading...</div>;
	}

	if (isErrorAdmins) {
		return <div>Error loading data</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-4">Kelola Admin</h1>

			<DataTableAdmin columns={columns} data={admins || []} />
		</div>
	);
}

export default function AdminPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<AdminPageContent />
		</QueryClientProvider>
	);
}
