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
							{isLoading
								? Array.from({ length: 5 }).map((_, index) => (
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
								  ))
								: galleryItems?.map((item, index) => (
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

				{error && (
					<p className="text-center text-red-500 mt-4">Gagal memuat galeri.</p>
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
