"use client";

import { useState } from "react";
import QrScanner from "@/components/qr-scanner";
import { AnggotaProfileCard } from "@/components/anggota-profile-card";
import { Anggota } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export default function VerifyPage() {
	const [anggotaData, setAnggotaData] = useState<Anggota | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showScanner, setShowScanner] = useState(false);

	const handleScanSuccess = async (decodedText: string) => {
		setShowScanner(false); // Matikan kamera setelah scan berhasil
		setLoading(true);
		setError(null);
		setAnggotaData(null);

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/anggota/token/${decodedText}`
			);
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Gagal mengambil data anggota.");
			}
			const data: Anggota = await res.json();
			setAnggotaData(data);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Terjadi kesalahan yang tidak diketahui.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleScanFailure = (errorMessage: string) => {
		setError(errorMessage);
		setShowScanner(false); // Matikan kamera jika ada error
	};

	const handleReset = () => {
		setAnggotaData(null);
		setError(null);
		setShowScanner(true); // Tampilkan kembali scanner
	};

	const handleStartScan = () => {
		setAnggotaData(null);
		setError(null);
		setShowScanner(true);
	};

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
			<div className="absolute bottom-4 right-4">
				<ModeToggle />
			</div>
			<div className="mb-8 flex flex-col items-center">
				<Image src="/pusamada-logo.png" alt="PUSAMADA" width={80} height={80} />
				<h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
					Verifikasi Kartu Anggota
				</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					Pindai QR Code pada kartu anggota untuk melihat detail keanggotaan.
				</p>
			</div>

			<div className="w-full max-w-md">
				{/* Tombol untuk memulai pemindaian */}
				{!showScanner && !anggotaData && !error && (
					<Button onClick={handleStartScan} size="lg">
						Mulai Pindai
					</Button>
				)}

				{/* Kontainer untuk QR Scanner */}
				<div
					className={`rounded-lg border bg-card p-4 shadow-sm ${
						showScanner ? "block" : "hidden"
					}`}
				>
					<QrScanner
						active={showScanner}
						onScanSuccess={handleScanSuccess}
						onScanFailure={handleScanFailure}
					/>
					<Button
						onClick={() => setShowScanner(false)}
						variant="outline"
						className="mt-4 w-full"
					>
						Batal
					</Button>
				</div>

				{loading && <p>Memverifikasi data...</p>}

				{error && (
					<Alert variant="destructive">
						<Terminal className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
						<Button onClick={handleReset} className="mt-4">
							Pindai Ulang
						</Button>
					</Alert>
				)}

				{anggotaData && (
					<div className="flex flex-col items-center gap-4">
						<AnggotaProfileCard anggota={anggotaData} />
						<Button onClick={handleReset} className="w-full max-w-sm">
							Pindai Kartu Lain
						</Button>
					</div>
				)}
			</div>
		</main>
	);
}
