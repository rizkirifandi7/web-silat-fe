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
	// Menggunakan ref untuk menyimpan instance scanner agar persisten antar-render
	const scannerRef = useRef<Html5Qrcode | null>(null);
	const scannerContainerId = "qr-reader";

	// Menyimpan callback dalam ref untuk memastikan useEffect tidak berjalan ulang
	// saat fungsi callback berubah, namun tetap memanggil versi terbaru.
	const callbacksRef = useRef({ onScanSuccess, onScanFailure });
	useEffect(() => {
		callbacksRef.current = { onScanSuccess, onScanFailure };
	}, [onScanSuccess, onScanFailure]);

	useEffect(() => {
		// Inisialisasi scanner hanya sekali saat komponen pertama kali dimuat
		if (!scannerRef.current) {
			scannerRef.current = new Html5Qrcode(scannerContainerId, {
				verbose: false,
			});
		}
		const scanner = scannerRef.current;

		const startScanner = async () => {
			try {
				// Memulai scanner hanya jika belum dalam keadaan memindai
				if (scanner.getState() !== Html5QrcodeScannerState.SCANNING) {
					await scanner.start(
						{ facingMode: "environment" },
						{ fps: 10, qrbox: { width: 250, height: 250 } },
						(decodedText) => {
							callbacksRef.current.onScanSuccess(decodedText);
						},
						() => {
							/* Abaikan callback saat QR tidak ditemukan */
						}
					);
				}
			} catch (err) {
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
				} else if (typeof err === "string") {
					detailedMessage = err;
				}
				callbacksRef.current.onScanFailure(
					`Gagal memulai kamera: ${detailedMessage}`
				);
			}
		};

		if (active) {
			startScanner();
		}

		// Fungsi cleanup: akan dipanggil saat komponen di-unmount atau sebelum
		// effect berjalan lagi. Ini adalah kunci untuk menghentikan kamera dengan aman.
		return () => {
			if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
				scanner
					.stop()
					.catch((err) =>
						console.error("Gagal menghentikan scanner saat cleanup.", err)
					);
			}
		};
	}, [active]); // Effect ini hanya bergantung pada prop 'active'

	return <div id={scannerContainerId} className="w-full max-w-md rounded-lg" />;
};

export default QrScanner;
