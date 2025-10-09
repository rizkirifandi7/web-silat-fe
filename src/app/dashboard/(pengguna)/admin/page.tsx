"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { columns } from "@/components/data-table-admin-columns";
import { DataTableAdmin } from "@/components/data-table-admin";
import { useAdminCrud } from "@/hooks/use-admin-crud";

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
