"use client";

import React, { useState } from "react";
import { EventCard } from "@/components/event/event-card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react"; // Data dummy untuk seminar
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
		image: "/no-image.jpg",
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
		image: "/no-image.jpg",
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
		image: "/no-image.jpg",
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
		image: "/no-image.jpg",
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
		image: "/no-image.jpg",
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
		image: "/no-image.jpg",
	},
];

const categories = ["Semua", "Seminar", "Workshop", "Pelatihan", "Diskusi"];

const PageEvent = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Semua");

	// Filter events berdasarkan search dan kategori
	const filteredEvents = eventsData.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "Semua" || event.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12 space-y-4">
					<h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-4xl">
						Event & Seminar
					</h1>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Ikuti berbagai seminar, workshop, dan pelatihan pencak silat untuk
						mengembangkan pengetahuan dan keterampilan Anda
					</p>
				</div>

				{/* Filter Section */}
				<div className="mb-8 flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							type="text"
							placeholder="Cari event atau seminar..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="w-full md:w-[200px]">
							<Filter className="h-4 w-4 mr-2" />
							<SelectValue placeholder="Kategori" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category} value={category}>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Results Count */}
				<div className="mb-6">
					<p className="text-sm text-muted-foreground">
						Menampilkan {filteredEvents.length} dari {eventsData.length} event
					</p>
				</div>

				{/* Events Grid */}
				{filteredEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredEvents.map((event, index) => (
							<EventCard key={event.id} {...event} index={index} />
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-lg text-muted-foreground">
							Tidak ada event yang sesuai dengan pencarian Anda
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default PageEvent;
