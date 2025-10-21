"use client";

import { useUserContext } from "@/context/user-context";
// Urutan tingkatan sabuk dari terendah ke tertinggi
const urutanSabuk = [
	"Sabuk Hitam Wiraga 1",
	"Sabuk Hitam Wiraga 2",
	"Sabuk Hitam Wiraga 3",
	"Sabuk Hijau",
	"Sabuk Merah",
	"Sabuk Putih",
	"Sabuk Kuning",
];

function bisaAksesMateri(tingkatanAnggota: string, tingkatanMateri: string) {
	const idxAnggota = urutanSabuk.indexOf(tingkatanAnggota);
	const idxMateri = urutanSabuk.indexOf(tingkatanMateri);
	if (idxAnggota === -1 || idxMateri === -1) return false;
	return idxAnggota >= idxMateri;
}

import React, { useState } from "react";
import CourseSidebar from "@/components/course-sidebar";
import MateriViewer from "@/components/materi-viewer";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/use-courses";

interface Materi {
	id: number;
	judul: string;
	tipeKonten: string;
	konten: string;
	tingkatan: string;
}

const PageMateri = () => {
	const { courses, isLoading, isError } = useCourses();
	const { user } = useUserContext();
	// Gabungkan semua materi dari seluruh course (urutan sesuai courses)
	interface Course {
		id: number;
		Materi?: Materi[];
		Materis?: Materi[];
		// tambahkan properti lain jika diperlukan
	}

	const materiList: Materi[] = courses.flatMap(
		(course: Course) => course.Materi ?? course.Materis ?? []
	);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const selectedMateri = selectedIndex >= 0 ? materiList[selectedIndex] : null;

	const handleMateriSelect = (materi: Materi) => {
		const idx = materiList.findIndex((m) => m.id === materi.id);
		setSelectedIndex(idx);
	};

	// Cek apakah materi berikutnya terkunci
	const nextMateri =
		selectedIndex < materiList.length - 1
			? materiList[selectedIndex + 1]
			: null;
	const tingkatanAnggota = user?.tingkatan_sabuk || "";
	const isNextLocked = nextMateri
		? !bisaAksesMateri(tingkatanAnggota, nextMateri.tingkatan)
		: false;

	const handleNext = () => {
		if (selectedIndex < materiList.length - 1 && !isNextLocked) {
			setSelectedIndex(selectedIndex + 1);
		}
	};

	if (isLoading) {
		return (
			<div className="h-screen w-full flex flex-col">
				<div className="p-4 border-b">
					<h1 className="text-2xl font-bold">Ruang Materi</h1>
					<p className="text-muted-foreground">
						Selamat datang di pusat pembelajaran. Silakan pilih materi untuk
						memulai.
					</p>
				</div>
				<ResizablePanelGroup
					direction="horizontal"
					className="flex-grow rounded-lg border"
				>
					<ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
						<div className="p-4 space-y-4">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={75}>
						<div className="p-4 h-full">
							<Skeleton className="h-full w-full" />
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-destructive">
						Gagal Memuat Materi
					</h2>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-full flex flex-col p-4 md:p-6 gap-4">
			<div className="py-4">
				<h1 className="text-2xl font-bold">Ruang Materi</h1>
				<p className="text-muted-foreground">
					Selamat datang di pusat pembelajaran. Silakan pilih materi untuk
					memulai.
				</p>
			</div>
			<ResizablePanelGroup
				direction="horizontal"
				className="flex-grow rounded-lg border"
			>
				<ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
					<CourseSidebar
						courses={courses}
						onMateriSelect={handleMateriSelect}
						selectedMateriId={selectedMateri?.id || null}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={75}>
					<MateriViewer
						selectedMateri={selectedMateri}
						onNext={handleNext}
						hasNext={selectedIndex < materiList.length - 1}
						isNextLocked={isNextLocked}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export default PageMateri;
