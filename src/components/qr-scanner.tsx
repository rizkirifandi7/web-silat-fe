"use client";

import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

interface QrScannerProps {
	onScanSuccess: (decodedText: string) => void;
	onScanFailure: (error: string) => void;
	active: boolean;
}

const QrScannerComponent: React.FC<QrScannerProps> = ({
	onScanSuccess,
	onScanFailure,
	active,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const scannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		if (active && videoRef.current) {
			scannerRef.current = new QrScanner(
				videoRef.current,
				(result) => {
					let token = result.data;
					try {
						const url = new URL(result.data);
						const pathParts = url.pathname.split("/").filter(Boolean);
						if (pathParts.length > 0) {
							token = pathParts[pathParts.length - 1];
						}
					} catch {
						console.log("Scanned data is not a URL, using raw data.");
					}
					onScanSuccess(token);
				},
				{
					onDecodeError: (error) => {
						// Ini bisa dipanggil berulang kali, jadi kita mungkin tidak ingin
						// membanjiri pengguna dengan pesan error.
						// Cukup log di konsol untuk debugging.
						console.log("QR Decode Error:", error);
					},
					highlightScanRegion: true,
					highlightCodeOutline: true,
				}
			);

			scannerRef.current.start().catch((err) => {
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

		return () => {
			if (scannerRef.current) {
				scannerRef.current.stop();
				scannerRef.current.destroy();
				scannerRef.current = null;
			}
		};
	}, [active, onScanSuccess, onScanFailure]);

	return (
		<div className="relative w-full max-w-md mx-auto">
			<video ref={videoRef} className="w-full h-[350px] rounded-lg" />
			<div className="absolute inset-0 border-4 border-white/50 rounded-lg pointer-events-none"></div>
		</div>
	);
};

export default QrScannerComponent;
