"use client";
import React, { useMemo } from "react";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/user-context";
import {
	IconBook,
	IconCertificate,
	IconTrophy,
	IconCalendar,
	IconChartBar,
	IconUser,
	IconBrandWhatsapp,
	IconMail,
	IconMapPin,
	IconTarget,
	IconAward,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/use-courses";
import { bisaAksesMateri } from "@/lib/sabuk-utils";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const getSabukColor = (sabuk: string) => {
	const colors: Record<string, string> = {
		Putih: "bg-gray-100 text-gray-800 border-gray-300",
		"Putih Strip Kuning": "bg-yellow-50 text-yellow-800 border-yellow-300",
		Kuning: "bg-yellow-100 text-yellow-800 border-yellow-400",
		"Kuning Strip Hijau": "bg-lime-100 text-lime-800 border-lime-400",
		Hijau: "bg-green-100 text-green-800 border-green-400",
		"Hijau Strip Biru": "bg-teal-100 text-teal-800 border-teal-400",
		Biru: "bg-blue-100 text-blue-800 border-blue-400",
		"Biru Strip Cokelat": "bg-amber-100 text-amber-800 border-amber-400",
		Cokelat: "bg-amber-200 text-amber-900 border-amber-500",
		"Cokelat Strip Hitam": "bg-gray-700 text-white border-gray-800",
		Hitam: "bg-gray-900 text-white border-gray-950",
	};
	return colors[sabuk] || "bg-gray-100 text-gray-800 border-gray-300";
};

export default function DashboardAnggotaPage() {
	// Gunakan UserContext yang sudah ada (centralized user management)
	const { user, isLoading: userLoading } = useUserContext();
	const { courses, isLoading: coursesLoading } = useCourses();
	const token = Cookies.get("accessToken");

	// Calculate stats with memoization for better performance
	const stats = useMemo(() => {
		if (!courses || !Array.isArray(courses) || !user) {
			return {
				totalCourses: 0,
				totalMateri: 0,
				accessibleCourses: 0,
				accessibleMateri: 0,
				progressPercentage: 0,
			};
		}

		const tingkatanAnggota = user.tingkatan_sabuk || "Belum punya";
		const totalMateri = courses.reduce(
			(acc, course) => acc + (course.Materis?.length || 0),
			0
		);

		// Hitung course dan materi yang bisa diakses
		let accessibleCourses = 0;
		let accessibleMateri = 0;

		courses.forEach((course) => {
			const materiList = course.Materis || [];
			const accessible = materiList.filter((materi) =>
				bisaAksesMateri(tingkatanAnggota, materi.tingkatan)
			);

			if (accessible.length > 0) {
				accessibleCourses++;
				accessibleMateri += accessible.length;
			}
		});

		const progressPercentage =
			totalMateri > 0 ? Math.round((accessibleMateri / totalMateri) * 100) : 0;

		return {
			totalCourses: courses.length,
			totalMateri,
			accessibleCourses,
			accessibleMateri,
			progressPercentage,
		};
	}, [courses, user]);

	// Loading state - tampilkan jika masih loading
	const isLoading = coursesLoading || userLoading;

	if (isLoading) {
		return (
			<div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8 flex items-center justify-center">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="text-center">Memuat Data...</CardTitle>
						<CardDescription className="text-center">
							Mohon tunggu sebentar
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state - tampilkan jika tidak ada token
	if (!token) {
		return (
			<div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8 flex items-center justify-center">
				<Card className="max-w-md w-full border-destructive">
					<CardHeader>
						<CardTitle className="text-destructive">Sesi Tidak Valid</CardTitle>
						<CardDescription>
							Anda belum login atau sesi telah berakhir.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							className="w-full"
							onClick={() => (window.location.href = "/login")}
						>
							Login Kembali
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header Section */}
				<div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
						Dashboard Anggota
					</h1>
					<p className="text-muted-foreground">
						Selamat datang kembali, {user?.nama?.split(" ")[0] || "Anggota"}! 👋
					</p>
				</div>

				{/* Profile Card - Enhanced */}
				<div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
					<Card className="overflow-hidden shadow-none hover:shadow-xl transition-shadow duration-300">
						<div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
						<CardContent className="relative pt-0 pb-6">
							<div className="flex flex-col md:flex-row gap-6 -mt-10">
								<div className="flex justify-center md:justify-start">
									<Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
										<AvatarImage
											src={user?.foto}
											alt={user?.nama}
											className="object-cover"
										/>
										<AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/60">
											{user?.nama?.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</div>

								<div className="flex-1 space-y-4 mt-4 md:mt-6">
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div>
											<h2 className="text-2xl font-bold text-center md:text-left">
												{user?.nama || "Unknown"}
											</h2>
											<p className="text-sm text-muted-foreground flex items-center gap-2 justify-center md:justify-start mt-1">
												<IconUser className="h-4 w-4" />
												Anggota Perguruan
											</p>
										</div>
										<Badge
											variant="outline"
											className={`px-4 py-2 text-sm font-semibold  ${getSabukColor(
												user?.tingkatan_sabuk || ""
											)}`}
										>
											<IconCertificate className="h-4 w-4 mr-2" />
											{user?.tingkatan_sabuk || "Unknown"}
										</Badge>
									</div>

									<Separator />

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
											<IconTrophy className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<p className="text-xs text-muted-foreground">
													Angkatan Unit
												</p>
												<p className="font-semibold">
													{user?.angkatan_unit || "-"}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
											<IconChartBar className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<p className="text-xs text-muted-foreground">
													Status Keanggotaan
												</p>
												<p className="font-semibold">
													{user?.status_keanggotaan || "-"}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
											<IconCertificate className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<p className="text-xs text-muted-foreground">
													Status Perguruan
												</p>
												<p className="font-semibold">
													{user?.status_perguruan || "-"}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
											<IconCalendar className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<p className="text-xs text-muted-foreground">
													Bergabung
												</p>
												<p className="font-semibold">
													{user?.createdAt
														? new Date(user.createdAt).toLocaleDateString(
																"id-ID",
																{ year: "numeric", month: "short" }
														  )
														: "-"}
												</p>
											</div>
										</div>
									</div>

									{(user?.no_telepon || user?.email || user?.alamat) && (
										<>
											<Separator />
											<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
												{user?.no_telepon && (
													<div className="flex items-center gap-2 text-sm">
														<IconBrandWhatsapp className="h-4 w-4 text-green-600" />
														<span className="text-muted-foreground">
															{user.no_telepon}
														</span>
													</div>
												)}
												{user?.email && (
													<div className="flex items-center gap-2 text-sm">
														<IconMail className="h-4 w-4 text-primary" />
														<span className="text-muted-foreground truncate">
															{user.email}
														</span>
													</div>
												)}
												{user?.alamat && (
													<div className="flex items-center gap-2 text-sm">
														<IconMapPin className="h-4 w-4 text-red-600" />
														<span className="text-muted-foreground truncate">
															{user.alamat}
														</span>
													</div>
												)}
											</div>
										</>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Stats Grid - Enhanced dengan lebih banyak informasi */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
					<Card className="shadow-none hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
						<CardHeader className="pb-3 relative">
							<div className="flex items-center justify-between">
								<CardDescription className="text-sm font-medium">
									Materi Tersedia
								</CardDescription>
								<div className="p-2 bg-blue-500/10 rounded-lg">
									<IconBook className="h-5 w-5 text-blue-500" />
								</div>
							</div>
						</CardHeader>
						<CardContent className="relative">
							<div className="space-y-2">
								<div className="flex items-baseline gap-2">
									<CardTitle className="text-3xl font-bold tabular-nums">
										{coursesLoading ? "..." : stats.accessibleCourses}
									</CardTitle>
									<span className="text-sm text-muted-foreground">
										/ {stats.totalCourses}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									Course dapat diakses
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-none hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
						<CardHeader className="pb-3 relative">
							<div className="flex items-center justify-between">
								<CardDescription className="text-sm font-medium">
									Total Materi
								</CardDescription>
								<div className="p-2 bg-green-500/10 rounded-lg">
									<IconTarget className="h-5 w-5 text-green-500" />
								</div>
							</div>
						</CardHeader>
						<CardContent className="relative">
							<div className="space-y-2">
								<div className="flex items-baseline gap-2">
									<CardTitle className="text-3xl font-bold tabular-nums">
										{coursesLoading ? "..." : stats.accessibleMateri}
									</CardTitle>
									<span className="text-sm text-muted-foreground">
										/ {stats.totalMateri}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									Materi pembelajaran
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-none hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
						<CardHeader className="pb-3 relative">
							<div className="flex items-center justify-between">
								<CardDescription className="text-sm font-medium">
									Tingkatan Sabuk
								</CardDescription>
								<div className="p-2 bg-amber-500/10 rounded-lg">
									<IconAward className="h-5 w-5 text-amber-500" />
								</div>
							</div>
						</CardHeader>
						<CardContent className="relative">
							<div className="space-y-2">
								<CardTitle className="text-xl font-bold truncate">
									{user?.tingkatan_sabuk || "Belum Ada"}
								</CardTitle>
								<p className="text-xs text-muted-foreground">Level saat ini</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-none hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
						<CardHeader className="pb-3 relative">
							<div className="flex items-center justify-between">
								<CardDescription className="text-sm font-medium">
									Progress Akses
								</CardDescription>
								<div className="p-2 bg-purple-500/10 rounded-lg">
									<IconChartBar className="h-5 w-5 text-purple-500" />
								</div>
							</div>
						</CardHeader>
						<CardContent className="relative">
							<div className="space-y-2">
								<CardTitle className="text-3xl font-bold tabular-nums">
									{coursesLoading ? "..." : stats.progressPercentage}%
								</CardTitle>
								<Progress value={stats.progressPercentage} className="h-2" />
								<p className="text-xs text-muted-foreground">Materi terbuka</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Courses & Quick Actions */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
					{/* Recent Courses - Enhanced */}
					<div className="lg:col-span-2">
						<Card className="shadow-none h-full">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<IconBook className="h-5 w-5" />
											Materi Terbaru
										</CardTitle>
										<CardDescription>
											Lanjutkan pembelajaran Anda
										</CardDescription>
									</div>
									<Link href="/dashboard-anggota/materi">
										<Button variant="ghost" size="sm">
											Lihat Semua
										</Button>
									</Link>
								</div>
							</CardHeader>
							<CardContent>
								{coursesLoading ? (
									<div className="space-y-3">
										{[1, 2, 3].map((i) => (
											<div key={i} className="animate-pulse">
												<div className="h-24 bg-muted rounded-lg" />
											</div>
										))}
									</div>
								) : courses.length > 0 ? (
									<div className="space-y-3">
										{courses.slice(0, 4).map((course) => {
											const tingkatanAnggota =
												user?.tingkatan_sabuk || "Belum punya";
											const materiList = course.Materis || [];
											const accessibleMateri = materiList.filter((materi) =>
												bisaAksesMateri(tingkatanAnggota, materi.tingkatan)
											);
											const canAccess = accessibleMateri.length > 0;

											return (
												<Link
													key={course.id}
													href={
														canAccess
															? `/dashboard-anggota/materi/${course.id}`
															: "#"
													}
												>
													<div
														className={`flex border items-center justify-between p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 group ${
															!canAccess ? "opacity-60 cursor-not-allowed" : ""
														}`}
													>
														<div className="flex items-start gap-3 flex-1">
															<div
																className={`p-2 rounded-lg group-hover:bg-primary/20 transition-colors ${
																	canAccess ? "bg-primary/10" : "bg-muted"
																}`}
															>
																<IconBook
																	className={`h-5 w-5 ${
																		canAccess
																			? "text-primary"
																			: "text-muted-foreground"
																	}`}
																/>
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 mb-1">
																	<h4 className="font-semibold text-sm truncate">
																		{course.nama_course}
																	</h4>
																	{course.tingkatan_sabuk && (
																		<Badge
																			variant="outline"
																			className="text-xs shrink-0"
																		>
																			{course.tingkatan_sabuk}
																		</Badge>
																	)}
																</div>
																<p className="text-xs text-muted-foreground line-clamp-1">
																	{course.deskripsi_course}
																</p>
																<div className="flex items-center gap-2 mt-2">
																	<Badge
																		variant={
																			canAccess ? "secondary" : "outline"
																		}
																		className="text-xs"
																	>
																		{accessibleMateri.length} /{" "}
																		{materiList.length} Materi
																	</Badge>
																	{!canAccess && (
																		<Badge
																			variant="destructive"
																			className="text-xs"
																		>
																			Terkunci
																		</Badge>
																	)}
																</div>
															</div>
														</div>
													</div>
												</Link>
											);
										})}
									</div>
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<IconBook className="h-12 w-12 mx-auto mb-2 opacity-50" />
										<p>Belum ada course tersedia</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div>
						<Card className="shadow-none h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<IconTrophy className="h-5 w-5" />
									Aksi Cepat
								</CardTitle>
								<CardDescription>Navigasi cepat</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<Link href="/dashboard-anggota/materi" passHref>
									<Button
										variant="outline"
										className="w-full justify-start h-auto py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
									>
										<IconBook className="h-5 w-5 mr-3" />
										<div className="text-left">
											<p className="font-semibold text-sm">Materi</p>
											<p className="text-xs opacity-70">Lihat semua materi</p>
										</div>
									</Button>
								</Link>
								<Link href="/dashboard-anggota/profile" passHref>
									<Button
										variant="outline"
										className="w-full justify-start h-auto py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
									>
										<IconCertificate className="h-5 w-5 mr-3" />
										<div className="text-left">
											<p className="font-semibold text-sm">Profil</p>
											<p className="text-xs opacity-70">Kelola profil Anda</p>
										</div>
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

