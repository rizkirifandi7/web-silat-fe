"use client";

import { useState, useCallback, Suspense, lazy } from "react";
import { AnggotaProfileCard } from "@/components/anggota-profile-card";
import { Anggota } from "@/lib/schema";
import { getAnggotaByToken } from "@/lib/anggota-api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2, Camera } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";

// Lazy load QR Scanner untuk performance
const QrScanner = lazy(() => import("@/components/qr-scanner"));

// Loading skeleton untuk QR Scanner
const ScannerSkeleton = () => (
	<div className="w-full max-w-md mx-auto">
		<div className="relative w-full h-[350px] rounded-lg bg-muted animate-pulse flex items-center justify-center">
			<div className="flex flex-col items-center gap-2 text-muted-foreground">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-sm">Memuat kamera...</p>
			</div>
		</div>
	</div>
);

type CameraState = "idle" | "loading" | "active" | "error";

export default function VerifyPage() {
	const [anggotaData, setAnggotaData] = useState<Anggota | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showScanner, setShowScanner] = useState(false);
	const [cameraState, setCameraState] = useState<CameraState>("idle");

	// Menggunakan useCallback untuk stabilitas function reference
	const handleScanSuccess = useCallback(async (decodedText: string) => {
		setShowScanner(false);
		setLoading(true);
		setError(null);
		setAnggotaData(null);
		setCameraState("idle");

		try {
			const data = await getAnggotaByToken(decodedText);

			if (!data) {
				throw new Error(
					"Data anggota tidak ditemukan. Token mungkin tidak valid atau telah kedaluwarsa."
				);
			}

			setAnggotaData(data);

			// Optional: Play success sound
			if (typeof Audio !== "undefined") {
				try {
					const audio = new Audio("/sounds/success.mp3");
					audio.volume = 0.3;
					audio.play().catch(() => {
						// Ignore audio play errors
						console.log("Audio play blocked by browser");
					});
				} catch {
					// Audio not supported or file not found
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Terjadi kesalahan yang tidak diketahui.");
			}
		} finally {
			setLoading(false);
		}
	}, []);

	const handleScanFailure = useCallback((errorMessage: string) => {
		setError(errorMessage);
		setShowScanner(false);
		setCameraState("error");
	}, []);

	const handleCameraReady = useCallback(() => {
		setCameraState("active");
	}, []);

	const handleReset = useCallback(() => {
		setAnggotaData(null);
		setError(null);
		setShowScanner(true);
		setCameraState("loading");
	}, []);

	const handleStartScan = useCallback(() => {
		setAnggotaData(null);
		setError(null);
		setShowScanner(true);
		setCameraState("loading");
	}, []);

	const handleCancelScan = useCallback(() => {
		setShowScanner(false);
		setCameraState("idle");
		setError(null);
	}, []);

	return (
		<>
			{!anggotaData && <Navbar />}
			<main
				className={`relative flex flex-col items-center justify-center bg-background p-4 text-center ${
					anggotaData ? "min-h-screen" : "min-h-[calc(100vh-8rem)]"
				}`}
				role="main"
				aria-label="Halaman Verifikasi Kartu Anggota"
			>
				<div className="mb-8 flex flex-col items-center">
					<Image
						src="/pusamada-logo.png"
						alt="Logo PUSAMADA"
						width={80}
						height={80}
						priority
					/>
					<h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
						Verifikasi Kartu Anggota
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						Pindai QR Code pada kartu anggota untuk melihat detail keanggotaan.
					</p>
				</div>

				<div className="w-full max-w-md">
					{/* Tombol untuk memulai pemindaian */}
					{!showScanner && !anggotaData && !loading && (
						<Button
							onClick={handleStartScan}
							size="lg"
							className="min-w-[200px]"
							aria-label="Mulai pemindaian QR Code"
						>
							<Camera className="mr-2 h-5 w-5" />
							Mulai Pindai
						</Button>
					)}

					{/* Kontainer untuk QR Scanner */}
					{showScanner && (
						<div className="rounded-lg border bg-card p-4 shadow-lg">
							<Suspense fallback={<ScannerSkeleton />}>
								<QrScanner
									active={showScanner}
									onScanSuccess={handleScanSuccess}
									onScanFailure={handleScanFailure}
									onCameraReady={handleCameraReady}
								/>
							</Suspense>

							{/* Camera status indicator */}
							{cameraState === "loading" && (
								<div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Menginisialisasi kamera...</span>
								</div>
							)}

							{cameraState === "active" && (
								<div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
									<div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
									<span>Kamera aktif</span>
								</div>
							)}

							<Button
								onClick={handleCancelScan}
								variant="outline"
								className="mt-4 w-full"
								aria-label="Batalkan pemindaian"
							>
								Batal
							</Button>
						</div>
					)}

					{/* Loading state */}
					{loading && (
						<div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-8">
							<Loader2 className="h-12 w-12 animate-spin text-primary" />
							<p className="text-lg font-medium">Memverifikasi data...</p>
							<p className="text-sm text-muted-foreground">
								Mohon tunggu sebentar
							</p>
						</div>
					)}

					{/* Error state */}
					{error && !loading && (
						<Alert variant="destructive" className="text-left">
							<Terminal className="h-4 w-4" />
							<AlertTitle>Terjadi Kesalahan</AlertTitle>
							<AlertDescription className="mt-2">{error}</AlertDescription>
							<Button
								onClick={handleReset}
								className="mt-4 w-full"
								variant="outline"
								aria-label="Coba pindai ulang"
							>
								<Camera className="mr-2 h-4 w-4" />
								Pindai Ulang
							</Button>
						</Alert>
					)}

					{/* Success state - Anggota data */}
					{anggotaData && !loading && (
						<div className="flex flex-col items-center gap-4 animate-in fade-in-50 duration-300">
							<AnggotaProfileCard anggota={anggotaData} />
							<Button
								onClick={handleReset}
								variant="outline"
								className="w-full"
								aria-label="Pindai kartu anggota lain"
							>
								<Camera className="mr-2 h-4 w-4" />
								Pindai Kartu Lain
							</Button>
						</div>
					)}
				</div>
			</main>
			{!anggotaData && <Footer />}
		</>
	);
}
