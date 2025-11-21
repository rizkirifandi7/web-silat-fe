"use client";

import * as React from "react";
import {
	IconBooks,
	IconCalendarEvent,
	IconCashBanknote,
	IconDashboard,
	IconLibraryPhoto,
	IconPlayCard1,
	IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard/beranda",
			icon: IconDashboard,
		},
		{
			title: "Galeri",
			url: "/dashboard/galeri",
			icon: IconLibraryPhoto,
		},
		{
			title: "Seminar",
			url: "/dashboard/seminar",
			icon: IconCalendarEvent,
		},
		{
			title: "Materi",
			url: "/dashboard/materi",
			icon: IconBooks,
		},
		{
			title: "Kartu Anggota",
			url: "/dashboard/kartu-anggota",
			icon: IconPlayCard1,
		},
		{
			title: "Donasi",
			url: "#",
			icon: IconCashBanknote,
			items: [
				{ title: "Kelola Campaign", url: "/dashboard/donasi" },
				{ title: "Metode Pembayaran", url: "/dashboard/payment-methods" },
			],
		},
		{
			title: "Pengguna",
			url: "#",
			icon: IconUsers,
			items: [
				{ title: "Anggota", url: "/dashboard/anggota" },
				{ title: "Admin", url: "/dashboard/admin" },
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<div>
								<Image
									src="/pusamada-logo.png"
									alt="PUSAMADA"
									width={32}
									height={32}
								/>
								<span className="text-base font-semibold">PUSAMADA.</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
