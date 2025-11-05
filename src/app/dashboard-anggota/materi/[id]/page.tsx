"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import CourseSidebar from "@/components/course-sidebar";
import MateriViewer from "@/components/materi-viewer";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCourses } from "@/hooks/use-courses";
import { ArrowLeft, Lock, Home } from "lucide-react";
import { bisaAksesMateri } from "@/lib/sabuk-utils";

interface Materi {
	id: number;
	judul: string;
	tipeKonten: string;
	konten: string;
	tingkatan: string;
}

const MateriDetailPage = () => {
	const params = useParams();
	const router = useRouter();
	const courseId = params.id ? Number(params.id) : null;

	const { courses, isLoading, isError } = useCourses();
	const { user } = useUserContext();

	const [selectedMateriId, setSelectedMateriId] = useState<number | null>(null);

	// Find selected course by ID from URL
	const selectedCourse = useMemo(
		() => courses.find((c) => c.id === courseId) ?? null,
		[courses, courseId]
	);

	const materiList = useMemo(
		() => selectedCourse?.Materis ?? [],
		[selectedCourse]
	);

	const selectedMateri = useMemo(
		() => materiList.find((m) => m.id === selectedMateriId) ?? null,
		[materiList, selectedMateriId]
	);

	const currentIndex = useMemo(
		() =>
			selectedMateriId
				? materiList.findIndex((m) => m.id === selectedMateriId)
				: -1,
		[materiList, selectedMateriId]
	);

	const tingkatanAnggota = user?.tingkatan_sabuk || "";

	const nextMateri = useMemo(
		() =>
			currentIndex >= 0 && currentIndex < materiList.length - 1
				? materiList[currentIndex + 1]
				: null,
		[currentIndex, materiList]
	);

	const isNextLocked = useMemo(
		() =>
			nextMateri
				? !bisaAksesMateri(tingkatanAnggota, nextMateri.tingkatan)
				: false,
		[nextMateri, tingkatanAnggota]
	);

	// Auto-select first materi when course loads
	React.useEffect(() => {
		if (materiList.length > 0 && !selectedMateriId) {
			setSelectedMateriId(materiList[0].id);
		}
	}, [materiList, selectedMateriId]);

	const handleMateriSelect = useCallback((materi: Materi) => {
		setSelectedMateriId(materi.id);
	}, []);

	const handleNext = useCallback(() => {
		if (
			currentIndex >= 0 &&
			currentIndex < materiList.length - 1 &&
			!isNextLocked
		) {
			setSelectedMateriId(materiList[currentIndex + 1].id);
		}
	}, [currentIndex, materiList, isNextLocked]);

	const handleBackToCourses = useCallback(() => {
		router.push("/dashboard-anggota/materi");
	}, [router]);

	// Loading State
	if (isLoading) {
		return (
			<div className="h-screen w-full flex flex-col">
				<div className="px-4 md:px-6 py-6 border-b bg-gradient-to-r from-background via-muted/20 to-background">
					<Skeleton className="h-6 w-64 mb-4" />
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-96" />
						</div>
						<Skeleton className="h-9 w-24" />
					</div>
				</div>
				<div className="flex-1">
					<ResizablePanelGroup direction="horizontal" className="h-full">
						<ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
							<div className="p-4 space-y-3">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={75}>
							<div className="p-6 space-y-4">
								<Skeleton className="h-8 w-64" />
								<Skeleton className="h-64 w-full" />
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		);
	}

	// Error State
	if (isError) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted/20">
				<Card className="max-w-md mx-4">
					<CardHeader>
						<CardTitle className="text-destructive flex items-center gap-2">
							<Lock className="h-5 w-5" />
							Gagal Memuat Materi
						</CardTitle>
						<CardDescription>
							Terjadi kesalahan saat mengambil data kursus. Silakan coba lagi.
						</CardDescription>
					</CardHeader>
					<CardFooter className="flex gap-2">
						<Button
							onClick={() => window.location.reload()}
							variant="outline"
							className="flex-1"
						>
							Muat Ulang
						</Button>
						<Button onClick={handleBackToCourses} className="flex-1">
							Kembali
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	// Course Not Found
	if (!selectedCourse) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted/20">
				<Card className="max-w-md mx-4">
					<CardHeader>
						<CardTitle className="text-destructive flex items-center gap-2">
							<Lock className="h-5 w-5" />
							Kursus Tidak Ditemukan
						</CardTitle>
						<CardDescription>
							Kursus yang Anda cari tidak ditemukan atau telah dihapus.
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button onClick={handleBackToCourses} className="w-full">
							Kembali ke Daftar Kursus
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="h-screen w-full flex flex-col">
			{/* Header dengan Breadcrumb */}
			<div className="px-4 md:px-6 py-4 border-b bg-gradient-to-r from-background via-muted/20 to-background">
				{/* Breadcrumb */}
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href="/dashboard-anggota"
								className="flex items-center gap-1"
							>
								<Home className="h-4 w-4" />
								<span>Dashboard</span>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard-anggota/materi">
								Daftar Materi
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{selectedCourse.judul}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Header Info */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h1 className="text-1xl md:text-2xl font-bold tracking-tight">
							{selectedCourse.judul}
						</h1>
						<p className="text-sm md:text-base text-muted-foreground">
							{selectedCourse.deskripsi}
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={handleBackToCourses}
						className="gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Kembali</span>
					</Button>
				</div>
			</div>

			{/* Content Area - ResizablePanel */}
			<div className="flex-1 overflow-hidden">
				<ResizablePanelGroup direction="horizontal" className="h-full">
					<ResizablePanel
						defaultSize={25}
						minSize={20}
						maxSize={40}
						className="border-r"
					>
						<CourseSidebar
							courses={[selectedCourse]}
							onMateriSelect={handleMateriSelect}
							selectedMateriId={selectedMateri?.id || null}
						/>
					</ResizablePanel>
					<ResizableHandle
						withHandle
						className="hover:bg-primary/20 transition-colors"
					/>
					<ResizablePanel defaultSize={75} minSize={60}>
						<MateriViewer
							selectedMateri={selectedMateri}
							onNext={handleNext}
							hasNext={currentIndex < materiList.length - 1}
							isNextLocked={isNextLocked}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default MateriDetailPage;
