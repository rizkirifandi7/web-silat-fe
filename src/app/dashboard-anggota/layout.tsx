"use client";

import { AppSidebarAnggota } from "@/components/app-sidebar-anggota";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const DashboardAnggotaLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// Jika pengguna valid, tampilkan layout dashboard
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
