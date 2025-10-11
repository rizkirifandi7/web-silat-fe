"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user"; // Import hook kustom
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const { user, isLoading } = useUser(); // Gunakan hook kustom

	useEffect(() => {
		// Jika proses loading data user belum selesai, jangan lakukan apa-apa.
		if (isLoading) {
			return;
		}

		// Setelah loading selesai, periksa apakah user tidak ada atau rolenya tidak sesuai.
		// Jika ya, alihkan ke halaman login.
		if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
			router.replace("/login");
		}
	}, [user, isLoading, router]); // Efek ini bergantung pada status user, loading, dan router.

	// Selama data masih loading atau user belum divalidasi (sebelum dialihkan),
	// tampilkan layar loading untuk mencegah render layout dashboard sesaat.
	if (
		isLoading ||
		!user ||
		(user.role !== "admin" && user.role !== "superadmin")
	) {
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
