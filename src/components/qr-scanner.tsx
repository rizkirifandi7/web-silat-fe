"use client";

import { useEffect, useRef, useCallback } from "react";
import QrScanner from "qr-scanner";

interface QrScannerProps {
	onScanSuccess: (decodedText: string) => void;
	onScanFailure: (error: string) => void;
	active: boolean;
	onCameraReady?: () => void;
}

const QrScannerComponent: React.FC<QrScannerProps> = ({
	onScanSuccess,
	onScanFailure,
	active,
	onCameraReady,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const scannerRef = useRef<QrScanner | null>(null);
	const lastScannedRef = useRef<{ token: string; time: number } | null>(null);
	const isProcessingRef = useRef(false);

	// Stable references untuk callbacks
	const onScanSuccessRef = useRef(onScanSuccess);
	const onScanFailureRef = useRef(onScanFailure);
	const onCameraReadyRef = useRef(onCameraReady);

	// Update refs saat props berubah
	useEffect(() => {
		onScanSuccessRef.current = onScanSuccess;
		onScanFailureRef.current = onScanFailure;
		onCameraReadyRef.current = onCameraReady;
	}, [onScanSuccess, onScanFailure, onCameraReady]);

	// Cooldown time dalam milliseconds (2 detik)
	const SCAN_COOLDOWN = 2000;

	// Fungsi untuk trigger haptic feedback (vibration)
	const triggerHapticFeedback = useCallback(() => {
		if (navigator.vibrate) {
			navigator.vibrate(200); // Vibrate for 200ms
		}
	}, []);

	// Handler untuk scan result dengan debouncing
	const handleScanResult = useCallback(
		(result: QrScanner.ScanResult) => {
			// Prevent concurrent processing
			if (isProcessingRef.current) {
				return;
			}

			let token = result.data;

			// Extract token dari URL jika ada
			try {
				const url = new URL(result.data);
				const pathParts = url.pathname.split("/").filter(Boolean);
				if (pathParts.length > 0) {
					token = pathParts[pathParts.length - 1];
				}
			} catch {
				// Bukan URL, gunakan raw data
				console.log("Scanned data is not a URL, using raw data.");
			}

			// Implementasi debouncing: cek apakah token yang sama baru saja di-scan
			const now = Date.now();
			if (
				lastScannedRef.current?.token === token &&
				now - lastScannedRef.current.time < SCAN_COOLDOWN
			) {
				console.log("Duplicate scan ignored (cooldown active)");
				return;
			}

			// Set processing flag
			isProcessingRef.current = true;

			// Update last scanned
			lastScannedRef.current = { token, time: now };

			// Trigger haptic feedback
			triggerHapticFeedback();

			// Call callback
			onScanSuccessRef.current(token);

			// Reset processing flag setelah delay
			setTimeout(() => {
				isProcessingRef.current = false;
			}, 500);
		},
		[triggerHapticFeedback]
	);

	useEffect(() => {
		if (active && videoRef.current && !scannerRef.current) {
			// Buat scanner instance baru
			scannerRef.current = new QrScanner(videoRef.current, handleScanResult, {
				onDecodeError: (error) => {
					// Silent error untuk decode failures (normal saat scanning)
					// Hanya log untuk debugging
					if (process.env.NODE_ENV === "development") {
						console.log("QR Decode Error:", error);
					}
				},
				highlightScanRegion: true,
				highlightCodeOutline: true,
				preferredCamera: "environment", // Prefer back camera on mobile
				maxScansPerSecond: 5, // Limit scan rate untuk performance
			});

			// Start scanner
			scannerRef.current
				.start()
				.then(() => {
					console.log("QR Scanner started successfully");
					onCameraReadyRef.current?.();
				})
				.catch((err) => {
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
							case "OverconstrainedError":
								detailedMessage =
									"Tidak dapat menemukan kamera yang memenuhi persyaratan.";
								break;
							case "SecurityError":
								detailedMessage =
									"Akses kamera diblokir karena alasan keamanan. Pastikan halaman diakses melalui HTTPS.";
								break;
							default:
								detailedMessage = err.message;
								break;
						}
					}
					console.error("Failed to start QR Scanner:", err);
					onScanFailureRef.current(`Gagal memulai kamera: ${detailedMessage}`);
				});
		} else if (!active && scannerRef.current) {
			// Stop dan cleanup scanner saat tidak active
			scannerRef.current.stop();
			scannerRef.current.destroy();
			scannerRef.current = null;
			isProcessingRef.current = false;
		}

		// Cleanup function
		return () => {
			if (scannerRef.current) {
				scannerRef.current.stop();
				scannerRef.current.destroy();
				scannerRef.current = null;
			}
			isProcessingRef.current = false;
		};
	}, [active, handleScanResult]);

	return (
		<div className="relative w-full max-w-md mx-auto">
			<video
				ref={videoRef}
				className="w-full h-[350px] rounded-lg object-cover"
				playsInline
				muted
			/>
			{/* Scan area overlay */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="relative w-full h-full">
					{/* Dark overlay with transparent center */}
					<div className="absolute inset-0 bg-black/50 rounded-lg">
						<div className="absolute inset-8 border-4 border-white/90 rounded-lg shadow-lg">
							{/* Corner decorations */}
							<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
							<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
							<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
							<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
						</div>
					</div>
				</div>
			</div>
			{/* Instruction text */}
			<div className="absolute bottom-2 left-0 right-0 text-center">
				<p className="text-sm text-white bg-black/60 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
					Arahkan kamera ke QR Code
				</p>
			</div>
		</div>
	);
};

export default QrScannerComponent;
