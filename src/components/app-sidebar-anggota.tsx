"use client";

import * as React from "react";
import {
	IconBooks,
	IconCalendarEvent,
	IconDashboard,
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
			url: "/dashboard-anggota/beranda",
			icon: IconDashboard,
		},
		{
			title: "Seminar",
			url: "/dashboard-anggota/seminar",
			icon: IconCalendarEvent,
		},
		{
			title: "Materi",
			url: "/dashboard-anggota/materi",
			icon: IconBooks,
		},
	],
};

export function AppSidebarAnggota({
	...props
}: React.ComponentProps<typeof Sidebar>) {
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
