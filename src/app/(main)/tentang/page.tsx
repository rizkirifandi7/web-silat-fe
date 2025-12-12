"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Star, Swords, Flag, Shield, CircleDot, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface PhilosophyItem {
	icon?: React.ElementType;
	title: string;
	description: string;
}

interface PengurusItem {
	nama: string;
	jabatan: string;
	fotoUrl: string;
}

interface AboutData {
	historyTitle: string;
	historySubtitle: string;
	historyContent: string;
	visionTitle: string;
	visionContent: string;
	missionTitle: string;
	missionContent: string[];
	philosophyTitle: string;
	philosophySubtitle: string;
	philosophyItems: PhilosophyItem[];
	managementTitle: string;
	managementSubtitle: string;
	managementMembers: PengurusItem[];
}

// Default icons for philosophy items
const defaultIcons = [Star, Swords, Flag, Shield, CircleDot, Sprout];

const PageTentang = () => {
	const [aboutData, setAboutData] = useState<AboutData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/about/active`,
					{
						cache: "no-store",
						headers: {
							"Cache-Control": "no-cache",
						},
					}
				);

				const result = await response.json();

				// Support both {success: true} and {status: "success"}
				const isSuccess =
					result.success === true || result.status === "success";
				const data = result.data;

				if (isSuccess && data) {
					setAboutData(data);
				} else {
					setDefaultData();
				}
			} catch (error) {
				console.error("❌ Error fetching about data:", error);
				setDefaultData();
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const setDefaultData = () => {
		setAboutData({
			historyTitle: "Sejarah Perguruan",
			historySubtitle: "Perjalanan PUSAMADA dari awal berdiri hingga saat ini.",
			historyContent:
				"Didirikan pada tahun 1980-an, Perguruan Pencak Silat Pusaka Mande Muda (PUSAMADA) lahir dari semangat untuk melestarikan aliran silat tradisional yang kaya akan nilai filosofis. Para pendiri, yang merupakan murid langsung dari para maestro silat terdahulu, merasa terpanggil untuk memastikan bahwa ilmu dan kearifan yang mereka terima tidak lekang oleh waktu.\n\nDengan berlandaskan pada ajaran luhur para guru, PUSAMADA berkembang dari sebuah kelompok latihan kecil menjadi sebuah organisasi yang terstruktur. Fokus utama kami tidak hanya pada aspek fisik bela diri, tetapi juga pada pembentukan karakter, disiplin, dan rasa cinta tanah air yang mendalam bagi setiap anggotanya.",
			visionTitle: "Visi",
			visionContent:
				"Menjadi pusat pelestarian dan pengembangan Pencak Silat yang menghasilkan pesilat berkarakter luhur, berprestasi, dan berjiwa nasionalis.",
			missionTitle: "Misi",
			missionContent: [
				"Melestarikan nilai-nilai asli Pencak Silat sebagai warisan budaya.",
				"Membentuk karakter anggota yang disiplin, hormat, dan bertanggung jawab.",
				"Mencetak atlet berprestasi di tingkat nasional dan internasional.",
				"Menjadi wadah positif bagi generasi muda untuk berkembang.",
			],
			philosophyTitle: "Filosofi Lambang PUSAMADA",
			philosophySubtitle:
				"Setiap elemen dalam lambang kami memiliki makna mendalam yang menjadi fondasi ajaran perguruan.",
			philosophyItems: [
				{ title: "Bintang", description: "Petunjuk dan Ilmu Pengetahuan." },
				{
					title: "Kujang & Keris",
					description: "Pertahanan Diri dan Warisan Guru.",
				},
				{
					title: "Bendera Merah Putih",
					description: "Jiwa Nasionalisme.",
				},
				{ title: "Segi Lima", description: "Panca Darma Pesilat." },
				{
					title: "Lingkaran Putih",
					description: "Sumber Asal dan Kesucian Hati.",
				},
				{
					title: "Tiga Daun",
					description: "Tiga Tuntunan Hidup (Tri Tangtu).",
				},
			],
			managementTitle: "Struktur Kepengurusan",
			managementSubtitle:
				"Orang-orang di balik layar yang berdedikasi memajukan PUSAMADA.",
			managementMembers: [
				{
					nama: "Nama Lengkap",
					jabatan: "Ketua Umum",
					fotoUrl: "https://placehold.co/400x400/27272a/fafafa?text=Foto",
				},
				{
					nama: "Nama Lengkap",
					jabatan: "Wakil Ketua",
					fotoUrl: "https://placehold.co/400x400/27272a/fafafa?text=Foto",
				},
				{
					nama: "Nama Lengkap",
					jabatan: "Sekretaris",
					fotoUrl: "https://placehold.co/400x400/27272a/fafafa?text=Foto",
				},
				{
					nama: "Nama Lengkap",
					jabatan: "Bendahara",
					fotoUrl: "https://placehold.co/400x400/27272a/fafafa?text=Foto",
				},
			],
		});
	};

	if (loading) {
		return (
			<div className="bg-background text-foreground">
				<div className="container mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-96 w-full" />
				</div>
			</div>
		);
	}

	if (!aboutData) return null;

	// Split history content into paragraphs
	const historyParagraphs = aboutData.historyContent
		.split("\n")
		.filter((p) => p.trim());

	return (
		<div className="bg-background text-foreground">
			<div className="container mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
				{/* Section Sejarah */}
				<section id="sejarah">
					<div className="text-center mb-12">
						<h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
							{aboutData.historyTitle}
						</h2>
						{aboutData.historySubtitle && (
							<p className="mt-4 max-w-3xl mx-auto text-sm md:text-base/relaxed text-muted-foreground">
								{aboutData.historySubtitle}
							</p>
						)}
					</div>
					<Card className="shadow-none">
						<CardContent className="p-8 space-y-6 text-muted-foreground text-base md:text-lg text-justify">
							{historyParagraphs.map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</CardContent>
					</Card>
				</section>

				{/* Section Pengurus */}
				{aboutData.managementMembers &&
					aboutData.managementMembers.length > 0 && (
						<section id="pengurus">
							<div className="text-center mb-12">
								<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
									{aboutData.managementTitle}
								</h2>
								{aboutData.managementSubtitle && (
									<p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
										{aboutData.managementSubtitle}
									</p>
								)}
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
								{aboutData.managementMembers.map((pengurus, index) => (
									<Card
										key={index}
										className="text-center flex flex-col items-center pt-6 shadow-none"
									>
										<CardContent className="flex flex-col items-center">
											<Avatar className="w-28 h-28 border-4 border-transparent group-hover:border-primary transition-colors">
												<AvatarImage
													src={pengurus.fotoUrl}
													alt={`Foto ${pengurus.nama}`}
												/>
												<AvatarFallback>
													{pengurus.nama.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<h3 className="mt-4 text-lg font-semibold text-foreground">
												{pengurus.nama}
											</h3>
											<p className="text-sm text-primary">{pengurus.jabatan}</p>
										</CardContent>
									</Card>
								))}
							</div>
						</section>
					)}

				{/* Section: Filosofi Lambang */}
				{aboutData.philosophyItems && aboutData.philosophyItems.length > 0 && (
					<section id="filosofi">
						<div className="text-center mb-12">
							<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
								{aboutData.philosophyTitle}
							</h1>
							{aboutData.philosophySubtitle && (
								<p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
									{aboutData.philosophySubtitle}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-12">
							{/* Left Column */}
							<div className="space-y-8">
								{aboutData.philosophyItems.slice(0, 3).map((item, index) => {
									const Icon = defaultIcons[index] || Star;
									return (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border bg-muted">
												<Icon className="h-6 w-6 text-primary" />
											</div>
											<div>
												<h3 className="text-lg font-semibold">{item.title}</h3>
												<p className="mt-1 text-muted-foreground">
													{item.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							{/* Center Column (Logo) */}
							<div className="flex justify-center">
								<Image
									src="/pusamada-logo.png"
									alt="Logo PUSAMADA"
									width={250}
									height={250}
									className="object-contain drop-shadow-lg"
									priority
								/>
							</div>

							{/* Right Column */}
							<div className="space-y-8">
								{aboutData.philosophyItems.slice(3, 6).map((item, index) => {
									const Icon = defaultIcons[index + 3] || Star;
									return (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border bg-muted">
												<Icon className="h-6 w-6 text-primary" />
											</div>
											<div>
												<h3 className="text-lg font-semibold">{item.title}</h3>
												<p className="mt-1 text-muted-foreground">
													{item.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</section>
				)}

				{/* Section Visi & Misi */}
				<section id="visi-misi">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
							Visi & Misi
						</h2>
						<p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
							Tujuan dan komitmen kami dalam mengembangkan Pencak Silat.
						</p>
					</div>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="text-primary">
									{aboutData.visionTitle}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									&quot;{aboutData.visionContent}&quot;
								</p>
							</CardContent>
						</Card>
						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="text-primary">
									{aboutData.missionTitle}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground list-disc list-inside">
									{aboutData.missionContent &&
										aboutData.missionContent.map((mission, index) => (
											<li key={index}>{mission}</li>
										))}
								</ul>
							</CardContent>
						</Card>
					</div>
				</section>
			</div>
		</div>
	);
};

export default PageTentang;

