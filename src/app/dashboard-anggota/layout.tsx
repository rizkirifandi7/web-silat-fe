"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AppSidebarAnggota } from "@/components/app-sidebar-anggota";

const queryClient = new QueryClient();

const DashboardAnggotaLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const router = useRouter();
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (!user || user.role !== "anggota") {
			router.replace("/login");
		}
	}, [user, isLoading, router]);

	if (isLoading || !user || user.role !== "anggota") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-muted-foreground">Memvalidasi sesi...</p>
			</div>
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<SidebarProvider
				style={
					{
						"--sidebar-width": "calc(var(--spacing) * 72)",
						"--header-height": "calc(var(--spacing) * 12)",
					} as React.CSSProperties
				}
			>
				<AppSidebarAnggota variant="inset" />
				<SidebarInset>
					<SiteHeader />
					<div className="p-4 md:p-6">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</QueryClientProvider>
	);
};

export default DashboardAnggotaLayout;
