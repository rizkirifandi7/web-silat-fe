"use client";

import { useEffect, useState } from "react";
import { RekeningGrid } from "@/components/rekening-grid";
import { getRekening } from "@/lib/rekening-api";
import { Rekening } from "@/lib/schema";

export default function DonasiPage() {
	const [rekeningData, setRekeningData] = useState<Rekening[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getRekening();
				setRekeningData(data);
			} catch (error) {
				console.error("Failed to fetch rekening:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Donasi
						</h1>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Dukungan Anda sangat berarti bagi kami. Dengan berdonasi, Anda
							turut serta dalam menjaga dan melestarikan budaya.
						</p>
					</div>
				</div>
				{isLoading ? (
					<div className="text-center py-10">
						<p className="text-lg text-muted-foreground">
							Memuat data rekening...
						</p>
					</div>
				) : rekeningData.length > 0 ? (
					<RekeningGrid rekeningData={rekeningData} />
				) : (
					<div className="text-center py-10">
						<p className="text-lg text-muted-foreground">
							Tidak ada rekening yang tersedia saat ini.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
