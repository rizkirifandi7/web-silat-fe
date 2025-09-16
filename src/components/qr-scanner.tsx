"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

interface QrScannerProps {
	onScanSuccess: (decodedText: string) => void;
	onScanFailure: (error: string) => void;
	active: boolean;
}

const QrScanner: React.FC<QrScannerProps> = ({
	onScanSuccess,
	onScanFailure,
	active,
}) => {
	// Ref untuk menunjuk ke elemen div, cara yang lebih aman daripada menggunakan ID
	const containerRef = useRef<HTMLDivElement>(null);
	// Ref untuk menyimpan instance scanner agar tidak dibuat ulang setiap render
	const scannerRef = useRef<Html5Qrcode | null>(null);

	useEffect(() => {
		// 1. Jika komponen tidak aktif, jangan lakukan apa-apa.
		if (!active) {
			return;
		}

		// 2. Pastikan elemen container sudah ada di DOM.
		if (!containerRef.current) {
			return;
		}

		// 3. Inisialisasi scanner hanya sekali saat pertama kali dibutuhkan.
		if (!scannerRef.current) {
			scannerRef.current = new Html5Qrcode(containerRef.current.id, {
				verbose: false, // Matikan log yang tidak perlu dari library
			});
		}
		const scanner = scannerRef.current;

		// 4. Mulai proses pemindaian.
		// Pastikan tidak memulai scanner yang sudah berjalan.
		if (scanner.getState() !== Html5QrcodeScannerState.SCANNING) {
			scanner
				.start(
					{ facingMode: "environment" }, // Gunakan kamera belakang
					{ fps: 10, qrbox: { width: 250, height: 250 } },
					(decodedText) => {
						// Callback saat scan berhasil
						let token = decodedText;
						try {
							// Ekstrak token jika hasil pindaian adalah URL
							const url = new URL(decodedText);
							const pathParts = url.pathname.split("/").filter(Boolean);
							if (pathParts.length > 0) {
								token = pathParts[pathParts.length - 1];
							}
						} catch (e) {
							// Jika bukan URL, gunakan teks hasil pindaian apa adanya.
						}
						// Kirim token yang sudah bersih ke komponen induk.
						onScanSuccess(token);
					},
					() => {
						/* Abaikan callback saat QR tidak ditemukan dalam satu frame */
					}
				)
				.catch((err) => {
					// Tangani error saat memulai kamera
					let detailedMessage = "An unknown error occurred.";
					if (err instanceof Error) {
						switch (err.name) {
							case "NotAllowedError":
								detailedMessage =
									"Akses ke kamera ditolak. Mohon izinkan akses kamera di pengaturan browser Anda.";
								break;
							case "NotFoundError":
								detailedMessage =
									"Tidak ada kamera yang ditemukan di perangkat ini.";
								break;
							case "NotReadableError":
								detailedMessage =
									"Kamera sedang digunakan oleh aplikasi lain atau terjadi masalah pada hardware.";
								break;
							default:
								detailedMessage = err.message;
								break;
						}
					}
					onScanFailure(`Gagal memulai kamera: ${detailedMessage}`);
				});
		}

		// 5. Fungsi Cleanup: Ini adalah bagian terpenting.
		// React akan menjalankan fungsi ini saat:
		//  a) Komponen di-unmount.
		//  b) Prop `active` berubah dari `true` ke `false` (misalnya saat "Batal" ditekan).
		return () => {
			if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
				scanner.stop().catch((err) => {
					// Kita bisa abaikan error di sini karena mungkin sudah dalam proses berhenti.
					console.error("Gagal menghentikan scanner di cleanup.", err);
				});
			}
		};
	}, [active, onScanSuccess, onScanFailure]);

	// 6. Render elemen div hanya jika scanner sedang aktif.
	// Ini memastikan `containerRef.current` tidak null saat `useEffect` berjalan.
	return active ? (
		<div id="qr-scanner-container" ref={containerRef} className="w-full" />
	) : null;
};

export default QrScanner;
