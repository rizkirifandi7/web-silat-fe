"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface MateriViewerProps {
	selectedMateri: {
		judul: string;
		tipeKonten: string;
		konten?: string | null; // konten bisa undefined atau null
	} | null;
	onNext?: () => void;
	hasNext?: boolean;
	isNextLocked?: boolean;
}

const MateriViewer: React.FC<MateriViewerProps> = ({
	selectedMateri,
	onNext,
	hasNext,
	isNextLocked,
}) => {
	const getYoutubeVideoId = (url?: string | null) => {
		// Validasi url terlebih dahulu
		if (!url || typeof url !== "string") {
			console.warn("[MateriViewer] Invalid URL for YouTube video:", url);
			return null;
		}

		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};

	const renderContent = () => {
		if (!selectedMateri) {
			return (
				<div className="flex h-full items-center justify-center bg-muted rounded-lg">
					<div className="text-center">
						<h2 className="text-2xl font-bold">
							Selamat Datang di Ruang Materi
						</h2>
					</div>
				</div>
			);
		}

		const { tipeKonten, konten, judul } = selectedMateri;

		// Validasi konten ada atau tidak
		if (!konten || konten.trim() === "") {
			return (
				<div className="flex h-full items-center justify-center bg-muted rounded-lg p-6">
					<div className="text-center space-y-2">
						<h3 className="text-xl font-semibold text-muted-foreground">
							Konten Belum Tersedia
						</h3>
						<p className="text-sm text-muted-foreground">
							Materi ini belum memiliki konten. Silakan hubungi administrator.
						</p>
					</div>
				</div>
			);
		}

		if (tipeKonten === "video") {
			const videoId = getYoutubeVideoId(konten);
			if (videoId) {
				// Build YouTube embed URL with enhanced security parameters
				const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);

				// Parameter untuk mencegah rekomendasi video
				embedUrl.searchParams.set("rel", "0"); // Tidak menampilkan rekomendasi video lain
				embedUrl.searchParams.set("showinfo", "0"); // Hide video info (deprecated but still works)
				embedUrl.searchParams.set("modestbranding", "1"); // Minimal YouTube branding

				// Parameter kontrol video
				embedUrl.searchParams.set("controls", "1"); // Tampilkan controls standar
				embedUrl.searchParams.set("disablekb", "1"); // Disable keyboard shortcuts
				embedUrl.searchParams.set("fs", "1"); // Allow fullscreen
				embedUrl.searchParams.set("playsinline", "1"); // Play inline on mobile

				// Parameter untuk hide elemen tambahan
				embedUrl.searchParams.set("iv_load_policy", "3"); // Hide annotations
				embedUrl.searchParams.set("cc_load_policy", "0"); // Hide captions by default
				embedUrl.searchParams.set("autohide", "1"); // Auto-hide controls

				// Parameter keamanan
				embedUrl.searchParams.set("enablejsapi", "0"); // Disable JS API
				embedUrl.searchParams.set("origin", window.location.origin); // Set origin untuk keamanan

				return (
					<AspectRatio ratio={16 / 9}>
						<div
							className="relative w-full h-full select-none"
							onContextMenu={(e) => {
								e.preventDefault();
								e.stopPropagation();
								return false;
							}}
							onMouseDown={(e) => {
								if (e.button === 2) {
									// Right click
									e.preventDefault();
									e.stopPropagation();
									return false;
								}
							}}
						>
							<iframe
								src={embedUrl.toString()}
								title={judul}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
								allowFullScreen
								className="w-full h-full rounded-lg select-none"
								style={{
									pointerEvents: "auto",
									userSelect: "none",
									WebkitUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									e.stopPropagation();
									return false;
								}}
							></iframe>
							{/* Transparent overlay untuk extra protection */}
							<div
								className="absolute inset-0 pointer-events-none select-none"
								onContextMenu={(e) => {
									e.preventDefault();
									return false;
								}}
								style={{
									userSelect: "none",
									WebkitTouchCallout: "none",
									WebkitUserSelect: "none",
									KhtmlUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
								}}
							/>
						</div>
					</AspectRatio>
				);
			}
			return (
				<div className="flex h-full items-center justify-center bg-muted rounded-lg p-6">
					<div className="text-center space-y-2">
						<p className="text-destructive font-medium">
							URL video tidak valid
						</p>
						<p className="text-sm text-muted-foreground">Format: {konten}</p>
					</div>
				</div>
			);
		}

		if (tipeKonten === "pdf") {
			return (
				<iframe
					src={konten}
					title={judul}
					className="w-full h-full rounded-lg border"
				></iframe>
			);
		}

		return (
			<div className="flex h-full items-center justify-center bg-muted rounded-lg p-6">
				<p className="text-muted-foreground">
					Tipe konten tidak didukung: {tipeKonten}
				</p>
			</div>
		);
	};

	return (
		<Card className="h-full flex flex-col border-none">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{selectedMateri?.judul || "Pilih Materi"}</CardTitle>
				{selectedMateri && hasNext && (
					<Button
						className="ml-4 px-4 py-2 rounded bg-primary text-white text-sm hover:bg-primary/80 disabled:bg-gray-400 disabled:cursor-not-allowed"
						onClick={onNext}
						disabled={isNextLocked}
						title={isNextLocked ? "Materi berikutnya terkunci" : undefined}
					>
						Lanjut <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				)}
			</CardHeader>
			<CardContent className="flex-grow">{renderContent()}</CardContent>
		</Card>
	);
};

export default MateriViewer;

