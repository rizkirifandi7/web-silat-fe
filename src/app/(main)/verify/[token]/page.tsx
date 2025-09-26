import { AnggotaProfileCard } from "@/components/anggota-profile-card";
import { ModeToggle } from "@/components/mode-toggle";
import { Anggota } from "@/lib/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Fungsi ini akan mengambil data anggota di sisi server berdasarkan token
async function getAnggotaByToken(token: string): Promise<Anggota | null> {
	try {
		// URL ini harus dapat diakses oleh server Next.js Anda
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/anggota/token/${token}`,
			{
				cache: "no-store", // Opsi ini memastikan data yang ditampilkan selalu yang terbaru
			}
		);

		if (!res.ok) {
			// Jika token tidak valid atau ada error dari server, kembalikan null
			return null;
		}

		const data: Anggota = await res.json();
		return data;
	} catch (error) {
		console.error("Gagal mengambil data anggota dari server:", error);
		return null;
	}
}

// Ini adalah halaman profil publik yang akan diakses melalui URL
export default async function AnggotaDetailPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	// Mengambil token dari URL, contoh: /verify/TOKEN_DISINI
	const { token } = await params;
	const anggota = await getAnggotaByToken(token);

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
			<div className="absolute top-4 right-4">
				<ModeToggle />
			</div>

			<div className="mb-8 flex flex-col items-center text-center">
				<Image
					src="/pusamada-logo.png"
					alt="PUSAMADA"
					width={80}
					height={80}
					className="dark:invert"
				/>
				<h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					Profil Anggota PUSAMADA
				</h1>
			</div>

			<div className="w-full max-w-md">
				{anggota ? (
					// Jika data anggota ditemukan, tampilkan kartu profil
					<AnggotaProfileCard anggota={anggota} />
				) : (
					// Jika tidak ditemukan, tampilkan pesan error
					<Alert variant="destructive">
						<Terminal className="h-4 w-4" />
						<AlertTitle>Data Tidak Ditemukan</AlertTitle>
						<AlertDescription>
							Profil anggota tidak dapat ditemukan. Token mungkin tidak valid
							atau telah kedaluwarsa.
						</AlertDescription>
					</Alert>
				)}
				<Button asChild variant="outline" className="mt-6 w-full">
					<Link href="/">Kembali ke Beranda</Link>
				</Button>
			</div>
		</main>
	);
}
