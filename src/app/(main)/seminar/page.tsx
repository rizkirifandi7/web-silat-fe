"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const PageSeminar = () => {
	const { seminar, loading, isError } = useSeminarCrud();

	if (loading) {
		return (
			<div className="w-full min-h-dvh bg-background">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Seminar
							</h1>
							<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Informasi mengenai seminar yang sedang dan akan datang.
							</p>
						</div>
					</div>

					<div className="mt-12 justify-center gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-self-center">
						{Array.from({ length: 6 }).map((_, index) => (
							<Card
								className="max-w-sm p-0 overflow-hidden shadow-none"
								key={index}
							>
								<Skeleton className="w-full h-56 rounded-t-lg" />
								<div className="px-5 pb-5 space-y-3 pt-4">
									<Skeleton className="h-6 w-3/4" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-10 w-20" />
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full min-h-dvh bg-background">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Seminar
							</h1>
							<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Terjadi kesalahan saat memuat data seminar.
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-dvh bg-background">
			<div className="container mx-auto px-4 py-16 md:py-24">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Seminar
						</h1>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Informasi mengenai seminar yang sedang dan akan datang.
						</p>
					</div>
				</div>

				<div className="mt-12 justify-center gap-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 justify-self-center">
					{seminar && seminar.length > 0 ? (
						seminar.map((item) => (
							<Card
								className="max-w-sm p-0 overflow-hidden shadow-none"
								key={item.id}
							>
								<Link href={`/seminar/${item.id}`}>
									<div className="relative w-full h-56">
										<Image
											className="object-cover rounded-t-lg"
											src={item.gambar || "/silat.jpg"}
											fill
											alt={item.judul}
										/>
									</div>
								</Link>
								<div className="px-4 pb-4">
									<Link
										href={`/seminar/${item.id}`}
										className="hover:underline"
									>
										<h1 className="text-xl mb-1 font-medium tracking-tight text-gray-900 dark:text-white">
											{item.judul}
										</h1>
									</Link>

									<div className="mb-2 flex items-center gap-2">
										<Badge
											variant={
												item.status === "Berlangsung"
													? "default"
													: item.status === "Akan Datang"
													? "secondary"
													: "outline"
											}
										>
											{item.status}
										</Badge>

										<Badge variant="outline">
											Kuota {item.kuota}
										</Badge>
									</div>

									<div className="">
										<p className="text-sm text-gray-600 dark:text-gray-400">
											Acara ini akan diselenggarakan pada{" "}
											{new Date(item.tanggal_mulai).toLocaleDateString(
												"id-ID",
												{
													day: "numeric",
													month: "long",
													year: "numeric",
												}
											)}{""}
										, pada pukul {item.waktu_mulai.slice(0, 5)} - {item.waktu_selesai.slice(0, 5)} WIB. {item.lokasi == "Online" ? "Acara ini akan diselenggarakan secara online." : `Lokasi: ${item.lokasi}`} | {item.harga === 0 ? "Gratis untuk diikuti." : `Biaya: Rp${item.harga.toLocaleString("id-ID")}.`}
										</p>
									</div>

									<Link
										href={`/seminar/${item.id}`}
										className="inline-flex mt-4 text-sm font-medium text-end rounded-md w-full"
									>
										<Button
											variant="outline"
											className="group w-full"
											disabled={item.status === "Selesai"}
										>
											{item.status === "Selesai" ? "Telah Selesai" : "Daftar"}
											{item.status !== "Selesai" && (
												<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
											)}
										</Button>
									</Link>
								</div>
							</Card>
						))
					) : (
						<div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								Belum ada seminar
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Saat ini belum ada seminar yang tersedia. Silakan cek kembali
								nanti.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PageSeminar;
