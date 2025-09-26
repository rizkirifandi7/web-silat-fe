import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn, ScanLine } from "lucide-react";
import Kujang from "./kujang-bg";

const Hero = () => {
	return (
		<main className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden bg-background px-8 text-center">
			{/* Background Effects */}
			<div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
			<div className="absolute -z-10 inset-0 h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

			{/* Kujang Background Component */}
			<Kujang />

			<div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
				{/* Logo Glow Effect */}
				<div className="absolute -z-10 mt-4 h-48 w-48 bg-primary/20 blur-3xl rounded-full" />
				<Image
					src="/pusamada-logo.png"
					alt="PUSAMADA"
					width={180}
					height={180}
					priority
					className="drop-shadow-lg"
				/>
				<p className="mt-6 text-2xl font-semibold tracking-wide">
					Pencak Silat
				</p>
				<h1 className="mt-2 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
					Pusaka Mande Muda Indonesia
				</h1>
				<p className="mt-4 max-w-2xl text-xl text-muted-foreground italic">
					&quot;Élmu Luhung Jembar Kabisa, Budi Suci Gede Bakti&quot;
				</p>
			</div>

			<div className="mt-10 flex flex-col gap-4 sm:flex-row animate-in fade-in zoom-in-95 duration-700 [animation-delay:300ms]">
				<Link href="/verify" passHref>
					<Button
						size="lg"
						className="w-full sm:w-auto transition-transform hover:-translate-y-1"
					>
						Verifikasi Anggota <ScanLine className="ml-2 h-4 w-4" />
					</Button>
				</Link>
				<Link href="/kontak" passHref>
					<Button
						size="lg"
						variant="outline"
						className="w-full sm:w-auto transition-transform hover:-translate-y-1"
					>
						Gabung Sekarang <LogIn className="ml-2 h-4 w-4" />
					</Button>
				</Link>
			</div>
		</main>
	);
};

export default Hero;
