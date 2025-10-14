"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAuthGuard } from "@/hooks/use-auth-guard";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	// Gunakan hook untuk proteksi rute
	const { isAccessing } = useAuthGuard(["admin", "superadmin"]);

	// Tampilkan loading jika akses sedang divalidasi
	if (isAccessing) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-muted-foreground">Memvalidasi sesi...</p>
			</div>
		);
	}

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
				<AppSidebar variant="inset" />
				<SidebarInset>
					<SiteHeader />
					<div className="p-4 md:p-6">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</QueryClientProvider>
	);
};

export default DashboardLayout;
