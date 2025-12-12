"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface AboutData {
	historyTitle: string;
	historySubtitle: string;
	historyContent: string;
}

const Tentang = () => {
	const [aboutData, setAboutData] = useState<AboutData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAboutData = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/about/active`,
					{
						cache: "no-store",
					}
				);

				const result = await response.json();
				if (result.status === "success" && result.data) {
					setAboutData({
						historyTitle: result.data.historyTitle || "Sejarah Kami",
						historySubtitle:
							result.data.historySubtitle ||
							"Mengenal lebih dekat dengan Pusaka Mande Muda",
						historyContent: result.data.historyContent || "",
					});
				}
			} catch (error) {
				console.error("Error fetching about data:", error);
				// Fallback ke data default jika gagal
				setAboutData({
					historyTitle: "Sejarah Kami",
					historySubtitle: "Mengenal lebih dekat dengan Pusaka Mande Muda",
					historyContent:
						"Didirikan oleh murid-murid langsung para maestro silat terdahulu, PUSAMADA berpegang pada ajaran luhur para guru agar ilmu dan kebijaksanaan yang diwariskan tidak lekang oleh waktu. Berawal dari kelompok latihan sederhana, PUSAMADA berkembang menjadi organisasi terstruktur dengan fokus pada pembentukan karakter, disiplin, dan cinta tanah air.",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchAboutData();
	}, []);

	// Fungsi untuk potong teks jika terlalu panjang (max 300 karakter)
	const truncateText = (text: string, maxLength: number = 300) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim() + "...";
	};

	return (
		<section className="py-16 md:py-24 overflow-hidden">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className={`text-center mb-12 md:mb-16 animate-fade-in-up`}>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
						Tentang Kami
					</h2>
					<p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
						{loading
							? "Memuat..."
							: aboutData?.historySubtitle ||
							  "Mengenal lebih dekat dengan Pusaka Mande Muda, organisasi yang berdedikasi melestarikan Pencak Silat."}
					</p>
				</div>

				{/* Sejarah Section */}
				{loading ? (
					<div className="flex justify-center items-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : (
					<div className="grid md:grid-cols-2 gap-8 items-center">
						<div
							className={`order-2 md:order-1 animate-slide-in-from-left`}
							style={{ animationDelay: "0.2s" }}
						>
							<h3 className="text-center md:text-left text-2xl sm:text-3xl font-bold mb-4">
								{aboutData?.historyTitle || "Sejarah Kami"}
							</h3>
							<p className="text-muted-foreground text-justify leading-relaxed text-sm sm:text-base">
								{aboutData?.historyContent
									? truncateText(aboutData.historyContent)
									: "Didirikan oleh murid-murid langsung para maestro silat terdahulu, PUSAMADA berpegang pada ajaran luhur para guru agar ilmu dan kebijaksanaan yang diwariskan tidak lekang oleh waktu. Berawal dari kelompok latihan sederhana, PUSAMADA berkembang menjadi organisasi terstruktur dengan fokus pada pembentukan karakter, disiplin, dan cinta tanah air."}
							</p>

							<Link
								href="/tentang"
								className="mt-8 flex items-center justify-center md:justify-start"
							>
								<Button variant="default" size="lg" className="group">
									Lihat Selengkapnya
									<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
								</Button>
							</Link>
						</div>
						<div
							className={`order-1 md:order-2 flex justify-center md:justify-end animate-slide-in-from-right`}
							style={{ animationDelay: "0.4s" }}
						>
							<div className="relative w-full max-w-[300px] sm:max-w-[400px] h-auto aspect-square">
								<Image
									src="/silat.png"
									alt="Sejarah Pusamada"
									fill
									className="rounded-lg shadow-none object-cover"
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Tentang;

