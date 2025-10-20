"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	CalendarIcon,
	ClockIcon,
	MapPinIcon,
	UsersIcon,
	LinkIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LexicalRenderer from "@/components/lexical-render";
import { Seminar } from "@/lib/schema";
import { getSeminarById } from "@/lib/seminar-api";
import { useParams } from "next/navigation";

const SeminarDetailPage = () => {
	const { id } = useParams();
	const [seminar, setSeminar] = useState<Seminar | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);

	const [isRegistered, setIsRegistered] = useState<boolean>(false);

	useEffect(() => {
		const fetchSeminar = async () => {
			try {
				if (Number.isNaN(Number(id))) {
					console.error("Invalid seminar id:", id);
					setIsError(true);
					return;
				}
				const response = await getSeminarById(Number(id));
				setSeminar(response);
			} catch (error) {
				console.error("Error fetching seminar data:", error);
				setIsError(true);
			} finally {
				setLoading(false);
			}
		};
		fetchSeminar();
	}, [id]);

	const handleRegister = () => {
		setIsRegistered(true);
	};

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "Akan Datang":
				return "default";
			case "Berlangsung":
				return "secondary";
			case "Selesai":
				return "outline";
			default:
				return "default";
		}
	};

	if (loading || seminar === null) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
				<Skeleton className="h-[400px] w-full" />
				<div className="container mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<div className="flex items-start gap-6 mb-8">
								<Skeleton className="w-32 h-32 rounded-2xl" />
								<div className="flex-1 space-y-3">
									<Skeleton className="h-8 w-3/4" />
									<Skeleton className="h-6 w-1/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							</div>
							<Card className="shadow-none">
								<CardContent>
									<Skeleton className="h-64 w-full" />
								</CardContent>
							</Card>
						</div>
						<div className="space-y-6">
							<Card className="shadow-none">
								<CardHeader>
									<Skeleton className="h-6 w-32" />
								</CardHeader>
								<CardContent className="space-y-4">
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-32 w-full" />
									<Skeleton className="h-10 w-full" />
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isError || !seminar) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold text-foreground">
						Seminar Tidak Ditemukan
					</h1>
					<p className="text-muted-foreground">
						Seminar yang Anda cari tidak dapat ditemukan atau terjadi kesalahan.
					</p>
					<Button asChild>
						<Link href="/seminar">Kembali ke Daftar Seminar</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			<div className="relative h-[400px] w-full overflow-hidden">
				<Image
					src={seminar.gambar_banner || seminar.gambar || "/silat.jpg"}
					alt={seminar.judul}
					fill
					className="object-cover"
					priority
				/>
			</div>

			<div className="container mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<div className="flex items-start gap-6 mb-8">
							<div className="relative w-32 h-32 flex-shrink-0">
								<Image
									src={seminar.gambar || "/silat.jpg"}
									alt={seminar.judul}
									fill
									className="object-cover rounded-2xl shadow-none"
								/>
							</div>
							<div className="flex-1 space-y-3">
								<h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
									{seminar.judul}
								</h1>
								<Badge variant={getStatusBadgeVariant(seminar.status)}>
									{seminar.status}
								</Badge>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<CalendarIcon className="h-4 w-4" />
										<span>
											{new Date(seminar.tanggal_mulai).toLocaleDateString(
												"id-ID"
											)}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<MapPinIcon className="h-4 w-4" />
										<span>{seminar.lokasi}</span>
									</div>
								</div>
							</div>
						</div>

						<Card className="shadow-none">
							<CardContent>
								<div className="prose prose-sm max-w-none dark:prose-invert">
									<h3 className="text-lg font-semibold mb-4">Deskripsi</h3>
									<div className="">
										<LexicalRenderer editorStateString={seminar.deskripsi} />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-6">
						<Card className="sticky top-24 shadow-none">
							<CardHeader>
								<CardTitle className="text-center">Registrasi</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<div className="flex items-center justify-center gap-2 mb-2">
										<span className="text-2xl font-bold">
											{seminar.harga === 0
												? "GRATIS"
												: `Rp ${seminar.harga.toLocaleString("id-ID")}`}
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Kuota tersedia: {seminar.kuota} orang
									</p>
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Status:</span>
										<Badge variant={getStatusBadgeVariant(seminar.status)}>
											{seminar.status}
										</Badge>
									</div>
									<div className="flex justify-between text-sm">
										<span>Kategori:</span>
										<span className="font-medium">Seminar</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>Diselenggarakan oleh:</span>
										<span className="font-medium">PUSAMADA</span>
									</div>
								</div>

								<Separator />

								{!isRegistered ? (
									<Button
										onClick={handleRegister}
										className="w-full"
										size="lg"
										disabled={seminar.status === "Selesai"}
									>
										{seminar.status === "Selesai"
											? "Acara Telah Selesai"
											: "Daftar Sekarang"}
									</Button>
								) : (
									<div className="text-center space-y-2">
										<Badge variant="secondary" className="w-full py-2">
											✓ Anda sudah terdaftar
										</Badge>
										<Button variant="outline" size="sm" className="w-full">
											Lihat Tiket
										</Button>
									</div>
								)}

								{seminar.link_acara && (
									<Button variant="outline" className="w-full" asChild>
										<a
											href={seminar.link_acara}
											target="_blank"
											rel="noopener noreferrer"
										>
											<LinkIcon className="h-4 w-4 mr-2" />
											Link Acara
										</a>
									</Button>
								)}
							</CardContent>
						</Card>

						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CalendarIcon className="h-5 w-5" />
									Detail Acara
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<CalendarIcon className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="font-sm text-muted-foreground">Tanggal</p>
												<p className="font-medium">
													{new Date(seminar.tanggal_mulai).toLocaleDateString(
														"id-ID"
													)}{" "}
													-{" "}
													{new Date(seminar.tanggal_selesai).toLocaleDateString(
														"id-ID"
													)}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<ClockIcon className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="font-sm text-muted-foreground">Waktu</p>
												<p className="font-medium">
													{seminar.waktu_mulai} - {seminar.waktu_selesai} WIB
												</p>
											</div>
										</div>
									</div>
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<MapPinIcon className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="font-sm text-muted-foreground">Lokasi</p>
												<p className="font-medium">{seminar.lokasi}</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<UsersIcon className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="font-sm text-muted-foreground">Kuota</p>
												<p className="font-medium">{seminar.kuota} peserta</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SeminarDetailPage;
