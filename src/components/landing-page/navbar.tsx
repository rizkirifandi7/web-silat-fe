"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/context/user-context";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
	{ href: "/", label: "Beranda" },
	{ href: "/tentang", label: "Tentang" },
	{ href: "/galeri", label: "Galeri" },
	{ href: "/katalog", label: "Katalog" },
	{ href: "/donasi", label: "Donasi" },
	{ href: "/kontak", label: "Kontak" },
];

const Logo = () => (
	<Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
		<Image
			src="/pusamada-logo.png"
			alt="Pusaka Mande Muda Logo"
			width={28}
			height={28}
			className="h-7 w-7"
		/>
		<span className="font-bold text-base tracking-wider">PUSAMADA</span>
	</Link>
);

const DesktopNav = () => {
	const pathname = usePathname();
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				{navLinks.map((link) => (
					<NavigationMenuItem key={link.href}>
						<NavigationMenuLink asChild>
							<Link
								href={link.href}
								className={cn(
									navigationMenuTriggerStyle(),
									"data-[active]:bg-accent/50"
								)}
								aria-current={pathname === link.href ? "page" : undefined}
							>
								{link.label}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const MobileNav = () => {
	const pathname = usePathname();
	const { user, logout } = useUserContext();

	const getDashboardLink = () => {
		if (!user) return "/";
		if (user.role === "admin" || user.role === "superadmin") {
			return "/dashboard/beranda";
		} else if (user.role === "anggota") {
			return "/dashboard-anggota/beranda";
		}
		return "/";
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Toggle menu"
					className="md:hidden"
				>
					<Menu className="h-6 w-6" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-full max-w-xs p-4">
				<SheetHeader>
					<SheetTitle>
						<Logo />
					</SheetTitle>
					<SheetDescription>Menu navigasi utama</SheetDescription>
				</SheetHeader>
				<nav className="mt-4 flex flex-col items-stretch space-y-2">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"block px-3 py-2 rounded-md text-base font-medium transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>
				<div className="mt-auto flex flex-col gap-2 pt-4">
					{user ? (
						<>
							<div className="flex items-center gap-2 px-3 py-2 border rounded-md">
								<Avatar className="h-8 w-8">
									<AvatarImage src={user.foto || ""} alt={user.nama} />
									<AvatarFallback>
										{user.nama
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()
											.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-medium">{user.nama}</span>
									<span className="text-xs text-muted-foreground">
										{user.email}
									</span>
								</div>
							</div>
							<Button variant="outline" asChild>
								<Link href={getDashboardLink()}>
									<LayoutDashboard className="mr-2 h-4 w-4" />
									Dashboard
								</Link>
							</Button>
							<Button variant="destructive" onClick={logout}>
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</Button>
						</>
					) : (
						<Button variant="outline" asChild>
							<Link href="/login">Login</Link>
						</Button>
					)}
					<ModeToggle />
				</div>
			</SheetContent>
		</Sheet>
	);
};

const UserMenu = () => {
	const { user, logout } = useUserContext();

	if (!user) return null;

	const getDashboardLink = () => {
		if (user.role === "admin" || user.role === "superadmin") {
			return "/dashboard/beranda";
		} else if (user.role === "anggota") {
			return "/dashboard-anggota/beranda";
		}
		return "/";
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-9 w-9 rounded-full">
					<Avatar className="h-9 w-9">
						<AvatarImage src={user.foto || ""} alt={user.nama} />
						<AvatarFallback>{getInitials(user.nama)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.nama}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={getDashboardLink()} className="cursor-pointer">
						<LayoutDashboard className="mr-2 h-4 w-4" />
						<span>Dashboard</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout} className="cursor-pointer">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const Navbar = () => {
	const { user } = useUserContext();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
			<div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between">
				<Logo />
				<DesktopNav />
				<div className="flex items-center gap-2">
					<div className="hidden md:flex md:items-center md:gap-2">
						{user ? (
							<UserMenu />
						) : (
							<Button variant="outline" size="sm" asChild>
								<Link href="/login">Login</Link>
							</Button>
						)}
						<ModeToggle />
					</div>
					<MobileNav />
				</div>
			</div>
		</header>
	);
};

export default Navbar;

