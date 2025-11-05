"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/course-card";
import { useCourses } from "@/hooks/use-courses";
import { useUserContext } from "@/context/user-context";
import { bisaAksesMateri } from "@/lib/sabuk-utils";
import { BookOpen, Lock, Home, ChevronDown, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 8; // Jumlah course yang ditampilkan per load

const PageMateri = () => {
	const router = useRouter();
	const { courses, isLoading, isError } = useCourses();
	const { user } = useUserContext();
	const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

	const tingkatanAnggota = user?.tingkatan_sabuk || "Belum punya";

	// Filter courses berdasarkan tingkatan sabuk anggota
	const filteredCourses = useMemo(() => {
		if (!courses || courses.length === 0) return [];

		// Jika belum punya sabuk, tidak tampilkan course apapun
		if (tingkatanAnggota === "Belum punya") {
			return [];
		}

		// Filter course yang memiliki minimal 1 materi yang bisa diakses
		return courses.filter((course) => {
			const materiList = course.Materis || [];
			// Cek apakah ada minimal 1 materi yang bisa diakses
			return materiList.some((materi) =>
				bisaAksesMateri(tingkatanAnggota, materi.tingkatan)
			);
		});
	}, [courses, tingkatanAnggota]);

	// Courses yang ditampilkan dengan pagination
	const displayedCourses = useMemo(
		() => filteredCourses.slice(0, displayCount),
		[filteredCourses, displayCount]
	);

	const hasMoreCourses = displayCount < filteredCourses.length;

	// Navigate to detail page when course is selected
	const handleOpenCourse = useCallback(
		(courseId: number) => {
			router.push(`/dashboard-anggota/materi/${courseId}`);
		},
		[router]
	);

	// Load more courses
	const handleLoadMore = useCallback(() => {
		setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
	}, []);

	// Loading State dengan skeleton yang lebih menarik
	if (isLoading) {
		return (
			<div className="h-screen w-full flex flex-col">
				<div className="p-6 border-b bg-gradient-to-r from-background to-muted/20">
					<Skeleton className="h-8 w-48 mb-2" />
					<Skeleton className="h-4 w-96" />
				</div>
				<div className="flex-1 p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Card key={i} className="overflow-hidden">
								<CardHeader>
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-full" />
								</CardHeader>
								<CardFooter>
									<Skeleton className="h-9 w-28" />
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Error State dengan UI yang lebih informatif
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
					<CardFooter>
						<Button
							onClick={() => window.location.reload()}
							variant="outline"
							className="w-full"
						>
							Muat Ulang
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full flex flex-col">
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
							<BreadcrumbPage>Daftar Materi</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Header Info */}
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<h1 className="text-1xl md:text-2xl font-bold tracking-tight">
							Ruang Materi
						</h1>
						<p className="text-sm md:text-base text-muted-foreground">
							Pilih kursus untuk memulai pembelajaran Anda
						</p>
					</div>
					{/* Info Badge Tingkatan & Total Course */}
					{!isLoading && (
						<div className="flex flex-col items-end gap-2">
							<Badge variant="secondary" className="whitespace-nowrap">
								<Filter className="h-3 w-3 mr-1" />
								{tingkatanAnggota}
							</Badge>
							<span className="text-xs text-muted-foreground">
								{filteredCourses.length} dari {courses.length} materi
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Content Area - Grid Card Kursus */}
			<div className="flex-1 overflow-y-auto p-4 md:p-6">
				{tingkatanAnggota === "Belum punya" ? (
					<Card className="max-w-md mx-auto mt-20">
						<CardHeader className="text-center">
							<Lock className="h-12 w-12 mx-auto mb-4 text-orange-500" />
							<CardTitle>Tingkatan Sabuk Belum Tersedia</CardTitle>
							<CardDescription>
								Anda belum memiliki tingkatan sabuk. Silakan hubungi admin untuk
								mendapatkan akses materi.
							</CardDescription>
						</CardHeader>
					</Card>
				) : filteredCourses.length === 0 ? (
					<Card className="max-w-md mx-auto mt-20">
						<CardHeader className="text-center">
							<BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
							<CardTitle>Tidak Ada Materi Tersedia</CardTitle>
							<CardDescription>
								Tidak ada materi yang sesuai dengan tingkatan sabuk Anda saat
								ini.
							</CardDescription>
						</CardHeader>
					</Card>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{displayedCourses.map((course, index) => (
								<CourseCard
									key={course.id}
									id={course.id}
									judul={course.judul}
									deskripsi={course.deskripsi}
									Materis={course.Materis}
									onSelect={handleOpenCourse}
									index={index}
								/>
							))}
						</div>

						{/* Load More Button */}
						{hasMoreCourses && (
							<div className="flex justify-center mt-8">
								<Button
									variant="outline"
									size="lg"
									onClick={handleLoadMore}
									className="gap-2"
								>
									<span>
										Tampilkan Lebih Banyak (
										{filteredCourses.length - displayCount} tersisa)
									</span>
									<ChevronDown className="h-4 w-4" />
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default PageMateri;
