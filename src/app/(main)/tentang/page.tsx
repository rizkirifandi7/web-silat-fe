import Image from "next/image";
import React from "react";
import { Star, Swords, Flag, Shield, CircleDot, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PhilosophyItem {
	icon: React.ElementType;
	title: string;
	description: string;
}

const philosophyItems: PhilosophyItem[] = [
	{
		icon: Star,
		title: "Bintang",
		description: "Petunjuk dan Ilmu Pengetahuan.",
	},
	{
		icon: Swords,
		title: "Kujang & Keris",
		description: "Pertahanan Diri dan Warisan Guru.",
	},
	{
		icon: Flag,
		title: "Bendera Merah Putih",
		description: "Jiwa Nasionalisme.",
	},
	{
		icon: Shield,
		title: "Segi Lima",
		description: "Panca Darma Pesilat.",
	},
	{
		icon: CircleDot,
		title: "Lingkaran Putih",
		description: "Sumber Asal dan Kesucian Hati.",
	},
	{
		icon: Sprout,
		title: "Tiga Daun",
		description: "Tiga Tuntunan Hidup (Tri Tangtu).",
	},
];

interface PengurusItem {
	nama: string;
	jabatan: string;
	fotoUrl: string;
}

const dataPengurus: PengurusItem[] = [
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
];

const PageTentang = () => {
	return (
		<div className="bg-background text-foreground">
			<div className="container mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
				{/* Section Sejarah */}
				<section id="sejarah">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
							Sejarah Perguruan
						</h2>
						<p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
							Perjalanan PUSAMADA dari awal berdiri hingga saat ini.
						</p>
					</div>
					<Card className="shadow-none">
						<CardContent className="p-8 space-y-6 text-muted-foreground text-base md:text-lg text-justify">
							<p>
								Didirikan pada tahun 1980-an, Perguruan Pencak Silat Pusaka
								Mande Muda (PUSAMADA) lahir dari semangat untuk melestarikan
								aliran silat tradisional yang kaya akan nilai filosofis. Para
								pendiri, yang merupakan murid langsung dari para maestro silat
								terdahulu, merasa terpanggil untuk memastikan bahwa ilmu dan
								kearifan yang mereka terima tidak lekang oleh waktu.
							</p>
							<p>
								Dengan berlandaskan pada ajaran luhur para guru, PUSAMADA
								berkembang dari sebuah kelompok latihan kecil menjadi sebuah
								organisasi yang terstruktur. Fokus utama kami tidak hanya pada
								aspek fisik bela diri, tetapi juga pada pembentukan karakter,
								disiplin, dan rasa cinta tanah air yang mendalam bagi setiap
								anggotanya.
							</p>
						</CardContent>
					</Card>
				</section>

				{/* Section Pengurus */}
				<section id="pengurus">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
							Struktur Kepengurusan
						</h2>
						<p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
							Orang-orang di balik layar yang berdedikasi memajukan PUSAMADA.
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{dataPengurus.map((pengurus, index) => (
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
										<AvatarFallback>{pengurus.nama.charAt(0)}</AvatarFallback>
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

				{/* Section: Filosofi Lambang */}
				<section id="filosofi">
					<div className="text-center mb-12">
						<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
							Filosofi Lambang PUSAMADA
						</h1>
						<p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
							Setiap elemen dalam lambang kami memiliki makna mendalam yang
							menjadi fondasi ajaran perguruan.
						</p>
					</div>

					<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-12">
						{/* Left Column */}
						<div className="space-y-8">
							{philosophyItems.slice(0, 3).map((item) => (
								<div key={item.title} className="flex items-start gap-4">
									<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border bg-muted">
										<item.icon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">{item.title}</h3>
										<p className="mt-1 text-muted-foreground">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Center Column (Logo) */}
						<div className="flex justify-center">
							<Image
								src="/pusamada-logo.png"
								alt="Logo PUSAMADA"
								width={300}
								height={300}
								className="object-contain drop-shadow-lg"
								priority
							/>
						</div>

						{/* Right Column */}
						<div className="space-y-8">
							{philosophyItems.slice(3, 6).map((item) => (
								<div key={item.title} className="flex items-start gap-4">
									<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border bg-muted">
										<item.icon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">{item.title}</h3>
										<p className="mt-1 text-muted-foreground">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

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
								<CardTitle className="text-primary">Visi</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									&quot;Menjadi pusat pelestarian dan pengembangan Pencak Silat
									yang menghasilkan pesilat berkarakter luhur, berprestasi, dan
									berjiwa nasionalis.&quot;
								</p>
							</CardContent>
						</Card>
						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="text-primary">Misi</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground list-disc list-inside">
									<li>
										Melestarikan nilai-nilai asli Pencak Silat sebagai warisan
										budaya.
									</li>
									<li>
										Membentuk karakter anggota yang disiplin, hormat, dan
										bertanggung jawab.
									</li>
									<li>
										Mencetak atlet berprestasi di tingkat nasional dan
										internasional.
									</li>
									<li>
										Menjadi wadah positif bagi generasi muda untuk berkembang.
									</li>
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
