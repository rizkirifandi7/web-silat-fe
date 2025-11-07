import { AnggotaProfileCard } from "@/components/anggota-profile-card";
import { Anggota } from "@/lib/schema";
import { getAnggotaByToken } from "@/lib/anggota-api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Ini adalah halaman profil publik yang akan diakses melalui URL
export default async function AnggotaDetailPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	// Mengambil token dari URL, contoh: /verify/TOKEN_DISINI
	const { token } = await params;

	let anggota: Anggota | null = null;
	let errorMessage: string | null = null;

	try {
		anggota = await getAnggotaByToken(token, {
			cache: "no-store", // Ensure fresh data
		});
	} catch (error) {
		console.error("Error fetching anggota:", error);
		errorMessage =
			error instanceof Error
				? error.message
				: "Terjadi kesalahan saat mengambil data anggota.";
	}

	return (
		<main
			className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8"
			role="main"
			aria-label="Halaman Profil Anggota"
		>
			<div className="mb-8 flex flex-col items-center text-center">
				<Image
					src="/pusamada-logo.png"
					alt="Logo PUSAMADA"
					width={80}
					height={80}
					priority
				/>
				<h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					Profil Anggota PUSAMADA
				</h1>
				{anggota && (
					<p className="mt-2 text-sm text-muted-foreground">
						Data anggota terverifikasi
					</p>
				)}
			</div>

			<div className="w-full max-w-md">
				{anggota ? (
					// Jika data anggota ditemukan, tampilkan kartu profil
					<div className="flex flex-col gap-4 animate-in fade-in-50 duration-300">
						<AnggotaProfileCard anggota={anggota} />
						<Link href="/verify" className="w-full">
							<Button variant="outline" className="w-full">
								Verifikasi Kartu Lain
							</Button>
						</Link>
					</div>
				) : (
					// Jika tidak ditemukan, tampilkan pesan error
					<div className="animate-in fade-in-50 duration-300">
						<Alert variant="destructive">
							<Terminal className="h-4 w-4" />
							<AlertTitle>Data Tidak Ditemukan</AlertTitle>
							<AlertDescription className="mt-2">
								{errorMessage ||
									"Profil anggota tidak dapat ditemukan. Token mungkin tidak valid atau telah kedaluwarsa."}
							</AlertDescription>
						</Alert>
						<Link href="/verify" className="w-full mt-4 block">
							<Button variant="outline" className="w-full">
								Kembali ke Verifikasi
							</Button>
						</Link>
					</div>
				)}
			</div>
		</main>
	);
}
