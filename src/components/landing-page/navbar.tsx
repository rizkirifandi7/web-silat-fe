"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan Anda memiliki utilitas cn dari shadcn

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();

	// Effect to handle body scroll when mobile menu is open
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto"; // Cleanup on component unmount
		};
	}, [isMenuOpen]);

	const navLinks = [
		{ href: "/", label: "Beranda" },
		{ href: "/tentang", label: "Tentang" },
		{ href: "/galeri", label: "Galeri" },
		{ href: "/kontak", label: "Kontak" },
		{ href: "/katalog", label: "Katalog" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between">
				<Link href="/" className="flex items-center space-x-3 ml-3 md:ml-0">
					<Image
						src="/pusamada-logo.png"
						alt="Pusaka Mande Muda Logo"
						width={28}
						height={28}
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
						<Link href="/login">
							<Button variant="outline" size="sm">
								Login
							</Button>
						</Link>
						<ModeToggle />
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle menu"
						>
							<X
								className={cn(
									"h-6 w-6 absolute transition-all duration-300",
									isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
								)}
							/>
							<Menu
								className={cn(
									"h-6 w-6 transition-all duration-300",
									isMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
								)}
							/>
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={cn(
					"absolute w-full border-t bg-background/95 md:hidden transition-all duration-300 ease-in-out",
					isMenuOpen
						? "opacity-100 visible translate-y-0"
						: "opacity-0 invisible -translate-y-4"
				)}
			>
				<nav className="flex flex-col items-stretch space-y-2 p-4">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"text-base transition-colors hover:text-primary p-3 rounded-md",
									isActive
										? "bg-muted text-primary font-semibold"
										: "text-muted-foreground"
								)}
								onClick={() => setIsMenuOpen(false)}
							>
								{link.label}
							</Link>
						);
					})}
					<div className="border-t pt-4 flex flex-col items-center gap-4">
						<Link href="/login" className="w-full">
							<Button variant="outline" className="w-full">
								Login
							</Button>
						</Link>
						<ModeToggle />
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
