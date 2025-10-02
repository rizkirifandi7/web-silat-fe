"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user"; // Import hook kustom
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const { user, isLoading } = useUser(); // Gunakan hook kustom

	// Selama pengecekan (isLoading), tampilkan loading state.
	// Ini adalah kunci untuk menghindari hydration error.
	if (isLoading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-muted-foreground">Memvalidasi sesi...</p>
			</div>
		);
	}

	// Setelah loading selesai, periksa pengguna dan alihkan jika perlu.
	// Pengalihan ini terjadi murni di sisi klien.
	if (!user || user.role !== "admin" && user.role !== "superadmin") {
		router.replace("/login");
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-muted-foreground">
					Akses ditolak. Mengarahkan ke halaman login...
				</p>
			</div>
		);
	}

	// Jika pengguna adalah ADMIN, tampilkan layout dashboard
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
