"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Calendar,
	MapPin,
	Users,
	Clock,
	ArrowLeft,
	CheckCircle2,
	User,
	Mail,
	Phone,
} from "lucide-react";
import Image from "next/image";

// Data dummy (sama dengan di halaman utama)
const eventsData = [
	{
		id: 1,
		title: "Seminar Nasional Pencak Silat Modern",
		description:
			"Membahas perkembangan pencak silat di era modern dan strategi pengembangan atlet muda berbakat",
		date: "15 Januari 2025",
		time: "09:00 - 15:00 WIB",
		location: "Gedung Balai Sidang Jakarta Convention Center, Jakarta",
		category: "Seminar",
		maxParticipants: 200,
		registeredParticipants: 145,
		image: "/placeholder-event-1.jpg",
		detailedDescription: `
			Seminar Nasional Pencak Silat Modern merupakan forum diskusi dan pembelajaran yang membahas 
			perkembangan pencak silat di era modern. Acara ini menghadirkan pembicara ahli dari berbagai 
			perguruan silat terkemuka di Indonesia.
		`,
		agenda: [
			{ time: "09:00 - 09:30", activity: "Registrasi Peserta" },
			{ time: "09:30 - 10:00", activity: "Pembukaan dan Sambutan" },
			{
				time: "10:00 - 12:00",
				activity: "Sesi 1: Sejarah dan Filosofi Pencak Silat Modern",
			},
			{ time: "12:00 - 13:00", activity: "Istirahat & Makan Siang" },
			{
				time: "13:00 - 14:30",
				activity: "Sesi 2: Strategi Pembinaan Atlet Muda",
			},
			{ time: "14:30 - 15:00", activity: "Diskusi dan Penutupan" },
		],
		speakers: [
			{ name: "Prof. Dr. Ahmad Suharto", title: "Pakar Pencak Silat Nasional" },
			{
				name: "Pelatnas. Budi Santoso",
				title: "Pelatih Tim Nasional Indonesia",
			},
			{ name: "Dr. Siti Nurhaliza", title: "Ahli Olahraga dan Kesehatan" },
		],
		facilities: [
			"Sertifikat Peserta",
			"Materi Seminar (Digital)",
			"Makan Siang & Coffee Break",
			"Souvenir Event",
			"Doorprize Menarik",
		],
		requirements: [
			"Minimal berusia 17 tahun",
			"Praktisi atau peminat pencak silat",
			"Mengisi formulir pendaftaran",
			"Melakukan pembayaran biaya pendaftaran",
		],
		registrationFee: "Rp 150.000",
		contactPerson: {
			name: "Andi Wijaya",
			phone: "+62 812-3456-7890",
			email: "event@pencaksilat.id",
		},
	},
	{
		id: 2,
		title: "Workshop Teknik Dasar Pencak Silat",
		description:
			"Pelatihan intensif teknik dasar pencak silat untuk pemula dengan instruktur berpengalaman",
		date: "20 Januari 2025",
		time: "08:00 - 16:00 WIB",
		location: "GOR Soemantri Brodjonegoro, Bandung",
		category: "Workshop",
		maxParticipants: 50,
		registeredParticipants: 50,
		image: "/placeholder-event-2.jpg",
		detailedDescription: `
			Workshop intensif yang dirancang khusus untuk pemula yang ingin mempelajari teknik dasar 
			pencak silat dengan benar dan sistematis. Dipandu oleh instruktur bersertifikat dengan 
			pengalaman lebih dari 15 tahun.
		`,
		agenda: [
			{ time: "08:00 - 08:30", activity: "Registrasi dan Persiapan" },
			{ time: "08:30 - 10:00", activity: "Teknik Kuda-kuda dan Sikap Pasang" },
			{ time: "10:00 - 10:15", activity: "Break" },
			{ time: "10:15 - 12:00", activity: "Teknik Pukulan dan Tangkisan" },
			{ time: "12:00 - 13:00", activity: "Istirahat & Makan Siang" },
			{ time: "13:00 - 15:00", activity: "Teknik Tendangan dan Elakan" },
			{ time: "15:00 - 16:00", activity: "Praktik Kombinasi dan Evaluasi" },
		],
		speakers: [
			{
				name: "Mas Guru Hadi Purnomo",
				title: "Instruktur Pencak Silat Bersertifikat",
			},
			{
				name: "Asisten Pelatih Rini Susanti",
				title: "Atlet Pencak Silat Berprestasi",
			},
		],
		facilities: [
			"Sertifikat Peserta",
			"Peralatan Latihan",
			"Makan Siang & Snack",
			"Modul Teknik Dasar",
			"Kaos Workshop",
		],
		requirements: [
			"Berusia 15 tahun ke atas",
			"Sehat jasmani dan rohani",
			"Membawa pakaian olahraga",
			"Tidak ada pengalaman pencak silat sebelumnya",
		],
		registrationFee: "Rp 200.000",
		contactPerson: {
			name: "Dian Pratiwi",
			phone: "+62 813-4567-8901",
			email: "workshop@pencaksilat.id",
		},
	},
	{
		id: 3,
		title: "Pelatihan Wasit Pencak Silat Tingkat Nasional",
		description:
			"Program sertifikasi wasit pencak silat tingkat nasional dengan materi komprehensif",
		date: "1 Februari 2025",
		time: "08:00 - 17:00 WIB",
		location: "Aula KONI Pusat, Jakarta",
		category: "Pelatihan",
		maxParticipants: 100,
		registeredParticipants: 78,
		image: "/placeholder-event-3.jpg",
		detailedDescription: `
			Program pelatihan dan sertifikasi wasit pencak silat yang diselenggarakan oleh 
			IPSI (Ikatan Pencak Silat Indonesia). Program ini memberikan pengetahuan komprehensif 
			tentang peraturan pertandingan dan teknik penilaian yang akurat.
		`,
		agenda: [
			{ time: "08:00 - 08:30", activity: "Registrasi" },
			{
				time: "08:30 - 10:30",
				activity: "Peraturan Pertandingan Pencak Silat",
			},
			{ time: "10:30 - 10:45", activity: "Coffee Break" },
			{ time: "10:45 - 12:30", activity: "Sistem Penilaian dan Scoring" },
			{ time: "12:30 - 13:30", activity: "Istirahat & Makan Siang" },
			{
				time: "13:30 - 15:30",
				activity: "Praktik Wasit dan Simulasi Pertandingan",
			},
			{ time: "15:30 - 16:30", activity: "Ujian Sertifikasi" },
			{ time: "16:30 - 17:00", activity: "Penutupan dan Pembagian Sertifikat" },
		],
		speakers: [
			{ name: "Drs. Bambang Suryanto", title: "Ketua Komisi Wasit IPSI" },
			{ name: "Ir. Slamet Riyadi", title: "Wasit Internasional PERSILAT" },
			{ name: "M. Yusuf Hidayat, S.Pd", title: "Instruktur Wasit Nasional" },
		],
		facilities: [
			"Sertifikat Wasit Nasional",
			"Buku Peraturan Pertandingan",
			"Makan Siang & Coffee Break",
			"Seragam Wasit",
			"Kartu Identitas Wasit",
		],
		requirements: [
			"Minimal berusia 21 tahun",
			"Memiliki pengetahuan dasar pencak silat",
			"Pendidikan minimal SMA/sederajat",
			"Melampirkan pas foto dan fotokopi KTP",
		],
		registrationFee: "Rp 500.000",
		contactPerson: {
			name: "Hendra Gunawan",
			phone: "+62 821-5678-9012",
			email: "wasit@ipsi.or.id",
		},
	},
	{
		id: 4,
		title: "Diskusi Panel: Prestasi Pencak Silat Indonesia",
		description:
			"Diskusi bersama atlet dan pelatih nasional membahas prestasi dan tantangan pencak silat Indonesia",
		date: "10 Februari 2025",
		time: "13:00 - 17:00 WIB",
		location: "Auditorium Universitas Negeri Jakarta",
		category: "Diskusi",
		maxParticipants: 150,
		registeredParticipants: 92,
		image: "/placeholder-event-4.jpg",
		detailedDescription: `
			Diskusi panel yang menghadirkan atlet pencak silat berprestasi, pelatih nasional, 
			dan tokoh olahraga untuk membahas capaian prestasi pencak silat Indonesia di kancah 
			internasional serta tantangan yang dihadapi ke depan.
		`,
		agenda: [
			{ time: "13:00 - 13:30", activity: "Registrasi Peserta" },
			{ time: "13:30 - 14:00", activity: "Pembukaan dan Pengantar" },
			{
				time: "14:00 - 15:30",
				activity: "Panel Diskusi Sesi 1: Prestasi dan Pencapaian",
			},
			{ time: "15:30 - 15:45", activity: "Coffee Break" },
			{
				time: "15:45 - 16:45",
				activity: "Panel Diskusi Sesi 2: Tantangan dan Solusi",
			},
			{ time: "16:45 - 17:00", activity: "Penutupan" },
		],
		speakers: [
			{
				name: "Hanifan Yudani",
				title: "Atlet Pencak Silat Medali Emas Asian Games",
			},
			{
				name: "Pelatnas. Johny Syahputra",
				title: "Pelatih Kepala Tim Nasional",
			},
			{ name: "Dr. Eko Prabowo", title: "Akademisi Olahraga UNJ" },
			{
				name: "Yulia Retnowati",
				title: "Atlet Pencak Silat Peraih Medali Dunia",
			},
		],
		facilities: [
			"Sertifikat Peserta",
			"Buku Panduan Diskusi",
			"Snack & Coffee Break",
			"Merchandise Event",
		],
		requirements: [
			"Terbuka untuk umum",
			"Praktisi, akademisi, atau peminat pencak silat",
			"Melakukan registrasi online",
		],
		registrationFee: "Gratis",
		contactPerson: {
			name: "Fitri Handayani",
			phone: "+62 822-6789-0123",
			email: "diskusi@pencaksilat.id",
		},
	},
	{
		id: 5,
		title: "Seminar Internasional Pencak Silat",
		description:
			"Seminar internasional dengan pembicara dari berbagai negara membahas pencak silat di kancah global",
		date: "25 Februari 2025",
		time: "09:00 - 16:00 WIB",
		location: "Hotel Borobudur, Jakarta",
		category: "Seminar",
		maxParticipants: 300,
		registeredParticipants: 267,
		image: "/placeholder-event-5.jpg",
		detailedDescription: `
			Seminar internasional yang menghadirkan pembicara dari berbagai negara untuk membahas 
			perkembangan pencak silat di tingkat global, strategi promosi, dan peluang kolaborasi 
			internasional. Event prestisius ini menjadi ajang networking bagi praktisi dan penggiat 
			pencak silat dari berbagai negara.
		`,
		agenda: [
			{ time: "09:00 - 09:30", activity: "Registrasi dan Welcome Coffee" },
			{ time: "09:30 - 10:00", activity: "Opening Ceremony" },
			{
				time: "10:00 - 12:00",
				activity: "Keynote Speech: Pencak Silat in Global Arena",
			},
			{ time: "12:00 - 13:00", activity: "Lunch Break" },
			{
				time: "13:00 - 15:00",
				activity: "Panel Discussion: International Collaboration",
			},
			{ time: "15:00 - 15:30", activity: "Coffee Break & Networking" },
			{ time: "15:30 - 16:00", activity: "Closing & Cultural Performance" },
		],
		speakers: [
			{
				name: "Tan Sri Dr. Abdul Halim Ali",
				title: "President PERSILAT (Malaysia)",
			},
			{ name: "Prof. Nguyen Van Minh", title: "Pencak Silat Expert (Vietnam)" },
			{
				name: "Sheikh Mohammed Al-Rashid",
				title: "Silat Federation Chairman (UAE)",
			},
			{ name: "Eddie Nalapraya", title: "Chairman IPSI Indonesia" },
			{ name: "Dr. Maria Santos", title: "Sports Scientist (Philippines)" },
		],
		facilities: [
			"International Certificate",
			"Conference Kit",
			"Lunch & Coffee Break",
			"Proceeding Book",
			"Exclusive Merchandise",
			"Networking Dinner",
		],
		requirements: [
			"Terbuka untuk peserta internasional",
			"Praktisi, akademisi, atau official pencak silat",
			"Melakukan registrasi dan pembayaran",
			"Mengisi formulir online",
		],
		registrationFee: "Rp 750.000 / USD 50",
		contactPerson: {
			name: "International Committee",
			phone: "+62 811-9012-3456",
			email: "international@ipsi.or.id",
		},
	},
	{
		id: 6,
		title: "Workshop Pencak Silat untuk Anak",
		description:
			"Workshop khusus mengajarkan pencak silat untuk anak usia 7-12 tahun dengan metode yang menyenangkan",
		date: "5 Maret 2025",
		time: "10:00 - 14:00 WIB",
		location: "Lapangan Silat Senayan, Jakarta",
		category: "Workshop",
		maxParticipants: 80,
		registeredParticipants: 65,
		image: "/placeholder-event-6.jpg",
		detailedDescription: `
			Workshop khusus dirancang untuk memperkenalkan pencak silat kepada anak-anak dengan 
			metode pembelajaran yang fun dan menyenangkan. Dipandu instruktur yang berpengalaman 
			dalam mengajar anak-anak dengan pendekatan edukatif dan interaktif.
		`,
		agenda: [
			{ time: "10:00 - 10:30", activity: "Registrasi dan Ice Breaking" },
			{
				time: "10:30 - 11:30",
				activity: "Pengenalan Dasar Pencak Silat untuk Anak",
			},
			{ time: "11:30 - 12:00", activity: "Games dan Permainan Edukatif" },
			{ time: "12:00 - 13:00", activity: "Istirahat & Makan Siang" },
			{ time: "13:00 - 13:45", activity: "Praktik Gerakan Dasar dengan Fun" },
			{ time: "13:45 - 14:00", activity: "Penutupan dan Pembagian Hadiah" },
		],
		speakers: [
			{ name: "Ibu Lastri Wulandari", title: "Instruktur Pencak Silat Anak" },
			{ name: "Kak Rizki Firmansyah", title: "Coach Anak Berpengalaman" },
		],
		facilities: [
			"Sertifikat Peserta",
			"Kaos Workshop",
			"Makan Siang & Snack",
			"Goodie Bag",
			"Dokumentasi Foto",
			"Medali Partisipasi",
		],
		requirements: [
			"Usia 7-12 tahun",
			"Sehat jasmani",
			"Didampingi orang tua/wali",
			"Membawa pakaian olahraga",
		],
		registrationFee: "Rp 100.000 per anak",
		contactPerson: {
			name: "Tim Kids Workshop",
			phone: "+62 813-2345-6789",
			email: "kids@pencaksilat.id",
		},
	},
];

const PageEventDetail = () => {
	const params = useParams();
	const router = useRouter();
	const eventId = Number(params.id);

	const event = eventsData.find((e) => e.id === eventId);

	if (!event) {
		return (
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container max-w-4xl mx-auto px-4 text-center">
					<h1 className="text-3xl font-bold mb-4">Event Tidak Ditemukan</h1>
					<p className="text-muted-foreground mb-8">
						Event yang Anda cari tidak tersedia atau sudah tidak aktif.
					</p>
					<Button onClick={() => router.push("/event")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Kembali ke Daftar Event
					</Button>
				</div>
			</section>
		);
	}

	const isFullyBooked = event.registeredParticipants >= event.maxParticipants;
	const availableSeats = event.maxParticipants - event.registeredParticipants;

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container max-w-6xl mx-auto px-4">
				{/* Back Button */}
				<Button
					variant="ghost"
					onClick={() => router.push("/event")}
					className="mb-6"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Kembali ke Daftar Event
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Header Image */}
						<div className="relative h-64 md:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
							{event.image ? (
								<Image
									src={event.image}
									alt={event.title}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Calendar className="w-24 h-24 text-primary/30" />
								</div>
							)}
							<div className="absolute top-4 right-4">
								<Badge
									variant={isFullyBooked ? "destructive" : "default"}
									className="text-base px-4 py-2"
								>
									{event.category}
								</Badge>
							</div>
						</div>{" "}
						{/* Title & Description */}
						<div>
							<h1 className="text-3xl md:text-4xl font-bold mb-4">
								{event.title}
							</h1>
							<p className="text-lg text-muted-foreground">
								{event.description}
							</p>
						</div>
						<Separator />
						{/* Detailed Description */}
						<Card>
							<CardHeader>
								<CardTitle>Tentang Event</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed whitespace-pre-line">
									{event.detailedDescription}
								</p>
							</CardContent>
						</Card>
						{/* Agenda */}
						<Card>
							<CardHeader>
								<CardTitle>Agenda Kegiatan</CardTitle>
								<CardDescription>
									Rundown acara dari awal hingga akhir
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{event.agenda?.map((item, index) => (
										<div key={index} className="flex gap-4">
											<div className="flex-shrink-0 w-32 font-medium text-primary">
												{item.time}
											</div>
											<div className="flex-1">
												<p className="text-muted-foreground">{item.activity}</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						{/* Speakers */}
						<Card>
							<CardHeader>
								<CardTitle>Narasumber</CardTitle>
								<CardDescription>Pembicara dan instruktur ahli</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{event.speakers?.map((speaker, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
												<User className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="font-semibold">{speaker.name}</p>
												<p className="text-sm text-muted-foreground">
													{speaker.title}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						{/* Facilities */}
						<Card>
							<CardHeader>
								<CardTitle>Fasilitas</CardTitle>
								<CardDescription>Yang akan Anda dapatkan</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{event.facilities?.map((facility, index) => (
										<div key={index} className="flex items-center gap-2">
											<CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
											<span className="text-muted-foreground">{facility}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						{/* Requirements */}
						<Card>
							<CardHeader>
								<CardTitle>Persyaratan</CardTitle>
								<CardDescription>Yang perlu Anda persiapkan</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{event.requirements?.map((requirement, index) => (
										<div key={index} className="flex items-start gap-2">
											<div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
											<span className="text-muted-foreground">
												{requirement}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-6">
							{/* Event Info Card */}
							<Card>
								<CardHeader>
									<CardTitle>Informasi Event</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-start gap-3">
										<Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-medium text-sm">Tanggal</p>
											<p className="text-muted-foreground">{event.date}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-medium text-sm">Waktu</p>
											<p className="text-muted-foreground">{event.time}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-medium text-sm">Lokasi</p>
											<p className="text-muted-foreground">{event.location}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-medium text-sm">Kuota Peserta</p>
											<p
												className={
													isFullyBooked
														? "text-destructive font-medium"
														: "text-muted-foreground"
												}
											>
												{isFullyBooked
													? "Kuota Penuh"
													: `${availableSeats} dari ${event.maxParticipants} kursi tersedia`}
											</p>
										</div>
									</div>

									<Separator />

									<div>
										<p className="font-medium text-sm mb-2">
											Biaya Pendaftaran
										</p>
										<p className="text-2xl font-bold text-primary">
											{event.registrationFee}
										</p>
									</div>

									<div className="pt-2">
										<div className="w-full bg-secondary rounded-full h-2 overflow-hidden mb-2">
											<div
												className={`h-full transition-all ${
													isFullyBooked ? "bg-destructive" : "bg-primary"
												}`}
												style={{
													width: `${
														(event.registeredParticipants /
															event.maxParticipants) *
														100
													}%`,
												}}
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											{event.registeredParticipants} dari{" "}
											{event.maxParticipants} peserta terdaftar
										</p>
									</div>

									<Button
										className="w-full"
										size="lg"
										disabled={isFullyBooked}
										variant={isFullyBooked ? "outline" : "default"}
									>
										{isFullyBooked ? "Kuota Penuh" : "Daftar Sekarang"}
									</Button>
								</CardContent>
							</Card>

							{/* Contact Person Card */}
							<Card>
								<CardHeader>
									<CardTitle>Kontak Person</CardTitle>
									<CardDescription>
										Untuk informasi lebih lanjut
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-center gap-3">
										<User className="w-5 h-5 text-primary flex-shrink-0" />
										<div>
											<p className="text-sm font-medium">
												{event.contactPerson?.name}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<Phone className="w-5 h-5 text-primary flex-shrink-0" />
										<a
											href={`tel:${event.contactPerson?.phone}`}
											className="text-sm text-muted-foreground hover:text-primary transition-colors"
										>
											{event.contactPerson?.phone}
										</a>
									</div>

									<div className="flex items-center gap-3">
										<Mail className="w-5 h-5 text-primary flex-shrink-0" />
										<a
											href={`mailto:${event.contactPerson?.email}`}
											className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
										>
											{event.contactPerson?.email}
										</a>
									</div>
								</CardContent>
							</Card>

							{/* Share Card */}
							<Card>
								<CardHeader>
									<CardTitle>Bagikan Event</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4">
										Ajak teman dan rekan Anda untuk ikut event ini
									</p>
									<div className="flex gap-2">
										<Button variant="outline" size="sm" className="flex-1">
											WhatsApp
										</Button>
										<Button variant="outline" size="sm" className="flex-1">
											Twitter
										</Button>
										<Button variant="outline" size="sm" className="flex-1">
											Copy Link
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PageEventDetail;
