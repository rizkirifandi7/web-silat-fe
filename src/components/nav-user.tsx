"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/user-context"; // Import hook kustom

import {
	IconDotsVertical,
	IconLogout,
	IconUserShield,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

import { Skeleton } from "./ui/skeleton";
import { AvatarImage } from "@radix-ui/react-avatar";

export function NavUser() {
	const router = useRouter();
	const { isMobile } = useSidebar();
	const { user, isLoading } = useUserContext(); // Gunakan context

	const handleLogout = () => {
		Cookies.remove("token");
		router.replace("/login");
	};

	const handleProfileClick = () => {
		if (user?.role === "anggota") {
			router.push("/dashboard-anggota/profile");
		} else {
			router.push("/dashboard/profile");
		}
	};

	const getInitials = (name: string) => {
		if (!name) return "AD";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	// Tampilkan skeleton loader saat data pengguna sedang divalidasi
	if (isLoading) {
		return (
			<div className="flex items-center gap-3 p-2">
				<Skeleton className="h-8 w-8 rounded-lg" />
				<div className="flex flex-1 flex-col gap-1">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-32" />
				</div>
			</div>
		);
	}

	// Jika tidak ada pengguna, jangan tampilkan apa-apa
	if (!user) {
		return null;
	}

	// Debug logging
	const getPhotoUrl = (foto: string) => {
		if (!foto) return "";
		// If foto is already a full URL (starts with http), use it directly
		if (foto.startsWith("http")) {
			return foto;
		}
		// Otherwise, construct the local API URL
		return `${process.env.NEXT_PUBLIC_API_URL}/anggota/${user.id}/${foto}`;
	};

	const photoUrl = getPhotoUrl(user?.foto || "");

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={photoUrl}
									alt={user?.nama}
									onError={(e) => {
										console.log("Avatar image failed to load:", photoUrl);
										console.log("Error:", e);
									}}
								/>
								<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
									{getInitials(user?.nama)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user?.nama}</span>
								<span className="text-muted-foreground truncate text-xs">
									{user?.role}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={photoUrl}
										alt={user?.nama}
										onError={(e) => {
											console.log(
												"Dropdown avatar image failed to load:",
												photoUrl
											);
											console.log("Error:", e);
										}}
									/>
									<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
										{getInitials(user?.nama)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user?.nama}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user?.role}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleProfileClick}>
							<IconUserShield className="mr-2" />
							Profil
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} className="text-red-500">
							<IconLogout className="mr-2" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
