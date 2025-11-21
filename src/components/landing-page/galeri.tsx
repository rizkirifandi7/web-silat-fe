"use client";

import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useGaleri } from "@/hooks/use-galeri";
import { Skeleton } from "../ui/skeleton";

const Galeri = () => {
	const { data: galleryItems, isLoading, error } = useGaleri();

	return (
		<section className="py-16 md:py-24 overflow-hidden">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className={`text-center mb-12 md:mb-16 animate-fade-in-up`}>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
						Kegiatan Kami
					</h2>
					<p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
						Intip berbagai momen dan kegiatan yang kami selenggarakan untuk
						mengembangkan diri dan melestarikan budaya.
					</p>
				</div>
				{isLoading ? (
					<div
						className={`animate-fade-in-up`}
						style={{ animationDelay: "0.2s" }}
					>
						<Carousel
							opts={{
								align: "start",
								loop: true,
							}}
							className="w-full"
						>
							<CarouselContent>
								{Array.from({ length: 5 }).map((_, index) => (
									<CarouselItem
										key={index}
										className="basis-full sm:basis-1/2 md:basis-1/3"
									>
										<div className="p-1">
											<Card className="overflow-hidden group">
												<CardContent className="p-0">
													<Skeleton className="aspect-[4/3] w-full" />
												</CardContent>
												<div className="p-4 bg-background">
													<Skeleton className="h-6 w-3/4 mb-2" />
													<Skeleton className="h-10 w-full" />
												</div>
											</Card>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="hidden md:flex" />
							<CarouselNext className="hidden md:flex" />
						</Carousel>
					</div>
				) : error ? (
					<div className="text-center py-12">
						<p className="text-red-500 text-lg">Gagal memuat galeri.</p>
						<p className="text-muted-foreground mt-2">
							Silakan coba lagi nanti.
						</p>
					</div>
				) : !galleryItems || galleryItems.length === 0 ? (
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-muted-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-foreground mb-2">
							Belum Ada Galeri
						</h3>
						<p className="text-muted-foreground">
							Galeri kegiatan akan segera ditampilkan di sini.
						</p>
					</div>
				) : (
					<div
						className={`animate-fade-in-up`}
						style={{ animationDelay: "0.2s" }}
					>
						<Carousel
							opts={{
								align: "start",
								loop: true,
							}}
							plugins={[
								Autoplay({
									delay: 3000,
								}),
							]}
							className="w-full"
						>
							<CarouselContent>
								{galleryItems.map((item, index) => (
									<CarouselItem
										key={index}
										className="basis-full sm:basis-1/2 md:basis-1/3"
									>
										<div className="p-1">
											<Card className="overflow-hidden group px-4 py-4 shadow-none">
												<div className="relative aspect-[4/3] w-full">
													<Image
														src={item.gambar}
														alt={item.judul}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-md border"
													/>
												</div>
												<div>
													<h3 className="font-semibold text-base sm:text-lg truncate">
														{item.judul}
													</h3>
													<p className="text-sm text-muted-foreground mt-1 h-10 truncate">
														{item.deskripsi}
													</p>
												</div>
											</Card>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="hidden md:flex" />
							<CarouselNext className="hidden md:flex" />
						</Carousel>
					</div>
				)}

				<div
					className={`text-center mt-12 animate-fade-in-up`}
					style={{ animationDelay: "0.4s" }}
				>
					<Link href="/galeri">
						<Button size="lg" className="group">
							Lihat Galeri Lengkap
							<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Galeri;
