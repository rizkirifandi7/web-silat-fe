"use client";

import * as React from "react";
import {
	IconDashboard,
	IconFolder,
	IconLibraryPhoto,
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
			title: "Anggota",
			url: "/dashboard/anggota",
			icon: IconUsers,
		},
		{
			title: "Kartu Anggota",
			url: "/dashboard/kartu-anggota",
			icon: IconFolder,
		},
		{
			title: "Galeri",
			url: "/dashboard/galeri",
			icon: IconLibraryPhoto,
		},
		{
			title: "Seminar",
			url: "/dashboard/seminar",
			icon: IconFolder,
		},
		{
			title: "Materi",
			url: "/dashboard/materi",
			icon: IconFolder,
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
