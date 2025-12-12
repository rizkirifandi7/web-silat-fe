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
import { useCourses } from "@/hooks/use-courses";
import { useUserContext } from "@/context/user-context";
import { bisaAksesMateri } from "@/lib/sabuk-utils";
import {
	BookOpen,
	Lock,
	Home,
	ChevronDown,
	Search,
	AlertCircle,
	TrendingUp,
	Target,
	Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ITEMS_PER_PAGE = 12; // Jumlah course yang ditampilkan per load

const PageMateri = () => {
	const router = useRouter();
	const { courses, isLoading, isError } = useCourses();
	const { user } = useUserContext();
	const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<
		"all" | "accessible" | "locked"
	>("all");

	const tingkatanAnggota = user?.tingkatan_sabuk || "Belum punya";

	// Stats calculation with memoization
	const stats = useMemo(() => {
		if (!courses || !Array.isArray(courses) || courses.length === 0) {
			return {
				totalCourses: 0,
				totalMateri: 0,
				accessibleCourses: 0,
				lockedCourses: 0,
				completionRate: 0,
			};
		}

		const totalCourses = courses.length;
		const totalMateri = courses.reduce(
			(sum, course) => sum + (course.Materis?.length || 0),
			0
		);

		const accessibleCourses = courses.filter((course) => {
			const tingkatanSabuk = course.tingkatan_sabuk ?? "Belum punya";
			return bisaAksesMateri(tingkatanAnggota, tingkatanSabuk);
		}).length;

		const lockedCourses = totalCourses - accessibleCourses;
		const completionRate =
			totalCourses > 0
				? Math.round((accessibleCourses / totalCourses) * 100)
				: 0;

		return {
			totalCourses,
			totalMateri,
			accessibleCourses,
			lockedCourses,
			completionRate,
		};
	}, [courses, tingkatanAnggota]);

	// Filter courses berdasarkan tingkatan sabuk anggota, search, dan filter status
	const filteredCourses = useMemo(() => {
		if (!courses || !Array.isArray(courses) || courses.length === 0) return [];

		let result = courses;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(course) =>
					course.nama_course.toLowerCase().includes(query) ||
					course.deskripsi_course?.toLowerCase().includes(query)
			);
		}

		// Filter by access status
		result = result.filter((course) => {
			const tingkatanSabuk = course.tingkatan_sabuk ?? "Belum punya";
			const hasAccess = bisaAksesMateri(tingkatanAnggota, tingkatanSabuk);

			if (filterStatus === "accessible") return hasAccess;
			if (filterStatus === "locked") return !hasAccess;
			return true; // "all"
		});

		return result;
	}, [courses, tingkatanAnggota, searchQuery, filterStatus]);

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
				<div className="flex-1 p-6 space-y-6">
					{/* Stats Skeleton */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<Card key={i}>
								<CardHeader className="pb-3">
									<Skeleton className="h-4 w-24 mb-2" />
									<Skeleton className="h-8 w-16" />
								</CardHeader>
							</Card>
						))}
					</div>

					{/* Filters Skeleton */}
					<div className="flex flex-col sm:flex-row gap-4">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-40" />
					</div>

					{/* Courses Grid Skeleton */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
		<div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-background via-muted/10 to-background">
			{/* Header dengan Breadcrumb */}
			<div className="px-4 md:px-6 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
				{/* Breadcrumb */}
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href="/dashboard-anggota"
								className="flex items-center gap-1 hover:text-primary transition-colors"
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
				<div className="flex flex-col space-y-4">
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-1">
							<h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Ruang Materi Pembelajaran
							</h1>
							<p className="text-sm md:text-base text-muted-foreground">
								Jelajahi dan pelajari materi sesuai tingkatan sabuk Anda
							</p>
						</div>
						{/* Info Badge Tingkatan */}
						{!isLoading && (
							<Badge variant="secondary" className="whitespace-nowrap">
								<Award className="h-3 w-3 mr-1" />
								{tingkatanAnggota}
							</Badge>
						)}
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<Card className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
							<CardHeader className="pb-3 relative">
								<div className="flex items-center justify-between">
									<BookOpen className="h-4 w-4 text-blue-500" />
									<Target className="h-8 w-8 text-blue-500/20 absolute -top-2 -right-2" />
								</div>
								<CardDescription className="text-xs">
									Total Materi
								</CardDescription>
								<CardTitle className="text-2xl">{stats.totalCourses}</CardTitle>
							</CardHeader>
						</Card>

						<Card className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
							<CardHeader className="pb-3 relative">
								<div className="flex items-center justify-between">
									<BookOpen className="h-4 w-4 text-green-500" />
									<TrendingUp className="h-8 w-8 text-green-500/20 absolute -top-2 -right-2" />
								</div>
								<CardDescription className="text-xs">
									Dapat Diakses
								</CardDescription>
								<CardTitle className="text-2xl text-green-600">
									{stats.accessibleCourses}
								</CardTitle>
							</CardHeader>
						</Card>

						<Card className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
							<CardHeader className="pb-3 relative">
								<div className="flex items-center justify-between">
									<Lock className="h-4 w-4 text-red-500" />
									<AlertCircle className="h-8 w-8 text-red-500/20 absolute -top-2 -right-2" />
								</div>
								<CardDescription className="text-xs">Terkunci</CardDescription>
								<CardTitle className="text-2xl text-red-600">
									{stats.lockedCourses}
								</CardTitle>
							</CardHeader>
						</Card>

						<Card className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
							<CardHeader className="pb-3 relative">
								<div className="flex items-center justify-between">
									<Award className="h-4 w-4 text-purple-500" />
									<Target className="h-8 w-8 text-purple-500/20 absolute -top-2 -right-2" />
								</div>
								<CardDescription className="text-xs">
									Progress Akses
								</CardDescription>
								<CardTitle className="text-2xl text-purple-600">
									{stats.completionRate}%
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Cari materi..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select
							value={filterStatus}
							onValueChange={(value: "all" | "accessible" | "locked") => setFilterStatus(value)}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Semua Materi</SelectItem>
								<SelectItem value="accessible">Dapat Diakses</SelectItem>
								<SelectItem value="locked">Terkunci</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Content Area - Grid Card Kursus */}
			<div className="flex-1 overflow-y-auto p-4 md:p-6">
				{tingkatanAnggota === "Belum punya" ? (
					<Alert className="max-w-md mx-auto mt-8">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Tingkatan Sabuk Belum Tersedia</AlertTitle>
						<AlertDescription>
							Anda belum memiliki tingkatan sabuk. Silakan hubungi admin untuk
							mendapatkan akses materi.
						</AlertDescription>
					</Alert>
				) : filteredCourses.length === 0 ? (
					<Alert className="max-w-md mx-auto mt-8">
						<BookOpen className="h-4 w-4" />
						<AlertTitle>Tidak Ada Materi Tersedia</AlertTitle>
						<AlertDescription>
							{searchQuery
								? `Tidak ada materi yang cocok dengan pencarian "${searchQuery}".`
								: "Tidak ada materi yang sesuai dengan filter yang dipilih."}
						</AlertDescription>
					</Alert>
				) : (
					<>
						{/* Info Banner */}
						{filteredCourses.length > 0 && (
							<div className="mb-6">
								<p className="text-sm text-muted-foreground">
									Menampilkan{" "}
									<span className="font-semibold text-foreground">
										{Math.min(displayCount, filteredCourses.length)}
									</span>{" "}
									dari{" "}
									<span className="font-semibold text-foreground">
										{filteredCourses.length}
									</span>{" "}
									materi
									{searchQuery && (
										<span>
											{" "}
											untuk pencarian{" "}
											<span className="font-semibold text-primary">
												&quot;{searchQuery}&quot;
											</span>
										</span>
									)}
								</p>
							</div>
						)}

						{/* Grid Kursus */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{displayedCourses.map((course) => {
								const tingkatanSabuk = course.tingkatan_sabuk ?? "Belum punya";
								const hasAccess = bisaAksesMateri(
									tingkatanAnggota,
									tingkatanSabuk
								);
								const totalMateri = course.Materis?.length || 0;
								const accessibleMateri =
									course.Materis?.filter((materi) =>
										bisaAksesMateri(tingkatanAnggota, materi.tingkatan)
									).length || 0;

								return (
									<Card
										key={course.id}
										className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-2 overflow-hidden ${
											hasAccess
												? "hover:border-primary/50"
												: "opacity-60 cursor-not-allowed border-muted"
										}`}
										onClick={() => hasAccess && handleOpenCourse(course.id)}
									>
										<div className="relative">
											{/* Gradient Overlay */}
											<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

											<CardHeader className="relative pb-3">
												<div className="flex items-start justify-between gap-2 mb-2">
													<CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
														{course.nama_course}
													</CardTitle>
													{!hasAccess && (
														<Lock className="h-4 w-4 text-destructive flex-shrink-0" />
													)}
												</div>

												<CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">
													{course.deskripsi_course || "Tidak ada deskripsi"}
												</CardDescription>

												{/* Stats */}
												<div className="flex items-center gap-3 mt-3 pt-3 border-t">
													<div className="flex items-center gap-1">
														<BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
														<span className="text-xs text-muted-foreground">
															{accessibleMateri} / {totalMateri} Materi
														</span>
													</div>
												</div>

												{/* Badges */}
												<div className="flex flex-wrap gap-1.5 mt-2">
													{tingkatanSabuk !== "Belum punya" && (
														<Badge
															variant="outline"
															className="text-[10px] px-1.5 py-0.5"
														>
															{tingkatanSabuk}
														</Badge>
													)}
													{!hasAccess && (
														<Badge
															variant="destructive"
															className="text-[10px] px-1.5 py-0.5"
														>
															Terkunci
														</Badge>
													)}
												</div>
											</CardHeader>

											<CardFooter className="pt-0 relative">
												<Button
													size="sm"
													variant={hasAccess ? "default" : "outline"}
													className="w-full"
													disabled={!hasAccess}
												>
													{hasAccess ? "Mulai Belajar" : "Terkunci"}
												</Button>
											</CardFooter>
										</div>
									</Card>
								);
							})}
						</div>

						{/* Load More Button */}
						{hasMoreCourses && (
							<div className="flex justify-center mt-8">
								<Button
									variant="outline"
									size="lg"
									onClick={handleLoadMore}
									className="gap-2 group"
								>
									<span>
										Tampilkan Lebih Banyak (
										{filteredCourses.length - displayCount} tersisa)
									</span>
									<ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
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

