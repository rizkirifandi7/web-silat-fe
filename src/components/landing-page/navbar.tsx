"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
	{ href: "/", label: "Beranda" },
	{ href: "/tentang", label: "Tentang" },
	{ href: "/galeri", label: "Galeri" },
	{ href: "/kontak", label: "Kontak" },
	{ href: "/seminar", label: "Seminar" },
	{ href: "/katalog", label: "Katalog" },
];

const Navbar = () => {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
			<div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between">
				<Link
					href="/"
					className="flex items-center space-x-3 rtl:space-x-reverse"
				>
					<Image
						src="/pusamada-logo.png"
						alt="Pusaka Mande Muda Logo"
						width={28}
						height={28}
						className="h-7 w-7"
					/>
					<span className="font-bold text-base tracking-wider">PUSAMADA</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-4 text-sm font-medium md:flex">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"transition-colors px-3 py-1.5 rounded-md hover:text-primary",
									isActive
										? "bg-muted text-primary font-semibold"
										: "text-muted-foreground"
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-2">
					{/* Desktop Buttons */}
					<div className="hidden md:flex md:items-center md:gap-2">
						<Button variant="outline" size="sm" asChild>
							<Link href="/login">Login</Link>
						</Button>
						<ModeToggle />
					</div>

					{/* Mobile Menu using Sheet */}
					<div className="md:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" aria-label="Toggle menu">
									<Menu className="h-6 w-6" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-full max-w-xs p-4">
								<div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
									<Image
										src="/pusamada-logo.png"
										alt="Pusaka Mande Muda Logo"
										width={28}
										height={28}
										className="h-7 w-7"
									/>
									<span className="font-bold text-base tracking-wider">
										PUSAMADA
									</span>
								</div>
								<nav className="flex flex-col items-stretch space-y-2">
									{navLinks.map((link) => {
										const isActive = pathname === link.href;
										return (
											<SheetClose asChild key={link.href}>
												<Link
													href={link.href}
													className={cn(
														"text-base transition-colors hover:text-primary p-3 rounded-md",
														isActive
															? "bg-muted text-primary font-semibold"
															: "text-muted-foreground"
													)}
												>
													{link.label}
												</Link>
											</SheetClose>
										);
									})}
								</nav>
								<div className="border-t mt-6 pt-6 flex flex-col items-center gap-4">
									<SheetClose asChild>
										<Button variant="outline" className="w-full" asChild>
											<Link href="/login">Login</Link>
										</Button>
									</SheetClose>
									<ModeToggle />
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
