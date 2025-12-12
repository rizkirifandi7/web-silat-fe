"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataTableAdmin } from "@/components/data-table/data-table-admin";
import { useAdminCrud } from "@/hooks/use-admin-crud";
import { columns } from "@/components/data-table-colum/data-table-admin-columns";
import { StatsCard } from "@/components/stats-card";
import { Shield, ShieldCheck, Users, UserCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const queryClient = new QueryClient();

function AdminPageContent() {
	const { admins, isLoadingAdmins, isErrorAdmins, stats, isLoadingStats } =
		useAdminCrud();

	if (isLoadingAdmins) {
		return (
			<div>
				<Skeleton className="h-8 w-1/4 mb-6" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
				<Skeleton className="h-10 w-full mb-4" />
				<Skeleton className="h-[500px] w-full" />
			</div>
		);
	}

	if (isErrorAdmins) {
		return <div>Error loading data</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-6">Manajemen Admin</h1>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
				<StatsCard
					title="Total Admin"
					value={isLoadingStats ? "..." : stats?.totalAdmins || 0}
					description="Jumlah seluruh admin"
					icon={Shield}
					iconColor="text-purple-600"
				/>
				<StatsCard
					title="Super Admin"
					value={isLoadingStats ? "..." : stats?.superAdmins || 0}
					description="Admin dengan akses penuh"
					icon={ShieldCheck}
					iconColor="text-red-600"
				/>
				<StatsCard
					title="Admin Reguler"
					value={isLoadingStats ? "..." : stats?.regularAdmins || 0}
					description="Admin dengan akses terbatas"
					icon={UserCog}
					iconColor="text-blue-600"
				/>
				<StatsCard
					title="Total Anggota"
					value={isLoadingStats ? "..." : stats?.totalMembers || 0}
					description="Jumlah seluruh anggota"
					icon={Users}
					iconColor="text-green-600"
				/>
			</div>

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

