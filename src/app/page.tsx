import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
			<div className="absolute bottom-4 right-4">
				<ModeToggle />
			</div>
			<div className="flex flex-col items-center">
				<Image
					src="/pusamada-logo.png"
					alt="PUSAMADA"
					width={120}
					height={120}
					priority
				/>
				<h1 className="mt-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
					Sistem Informasi PUSAMADA
				</h1>
				<p className="mt-4 max-w-2xl text-xl text-muted-foreground">
					Selamat datang di portal resmi Perguruan Pencak Silat PUSAMADA. Kelola
					data anggota dan verifikasi keanggotaan dengan mudah.
				</p>
			</div>

			<div className="mt-10 flex flex-col gap-4 sm:flex-row">
				<Link href="/verify" passHref>
					<Button size="lg" className="w-full sm:w-auto">
						Verifikasi Anggota (Scan QR)
					</Button>
				</Link>
				<Link href="/login" passHref>
					<Button size="lg" variant="outline" className="w-full sm:w-auto">
						Login Administrator
					</Button>
				</Link>
			</div>

			<footer className="absolute bottom-8 text-sm text-muted-foreground">
				© {new Date().getFullYear()} PUSAMADA. All rights reserved.
			</footer>
		</main>
	);
}
