"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MateriViewerProps {
	selectedMateri: {
		judul: string;
		tipeKonten: string;
		konten: string;
	} | null;
}

const MateriViewer: React.FC<MateriViewerProps> = ({ selectedMateri }) => {
	const getYoutubeVideoId = (url: string) => {
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
						<p className="text-muted-foreground">
							Pilih materi dari daftar di samping untuk memulai pembelajaran.
						</p>
					</div>
				</div>
			);
		}

		const { tipeKonten, konten, judul } = selectedMateri;

		if (tipeKonten === "video") {
			const videoId = getYoutubeVideoId(konten);
			if (videoId) {
				return (
					<AspectRatio ratio={16 / 9}>
						<iframe
							src={`https://www.youtube.com/embed/${videoId}`}
							title={judul}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="w-full h-full rounded-lg"
						></iframe>
					</AspectRatio>
				);
			}
			return <p>URL video tidak valid.</p>;
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

		return <p>Tipe konten tidak didukung.</p>;
	};

	return (
		<Card className="h-full flex flex-col border-none">
			<CardHeader>
				<CardTitle>{selectedMateri?.judul || "Pilih Materi"}</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">{renderContent()}</CardContent>
		</Card>
	);
};

export default MateriViewer;
