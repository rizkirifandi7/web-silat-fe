"use client";

import { Anggota } from "@/lib/schema";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";
import { Globe, Instagram, Facebook, Music2 } from "lucide-react";

interface KartuAnggotaProps {
	anggota: Anggota;
}

export function KartuAnggota({ anggota }: KartuAnggotaProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const qrCodeValue = `${baseUrl}/verify/${anggota.id_token}`;

	const downloadCard = useCallback(() => {
		if (cardRef.current) {
			toPng(cardRef.current, {
				cacheBust: true,
				pixelRatio: 4,
				style: {
					borderRadius: "0",
					border: "none",
				},
			})
				.then((dataUrl) => {
					const link = document.createElement("a");
					link.download = `kartu-anggota-${anggota.user.nama}.png`;
					link.href = dataUrl;
					link.click();
				})
				.catch((err) => {
					console.error("Gagal mengunduh kartu!", err);
				});
		}
	}, [anggota.user.nama]);

	return (
		<div className="space-y-2">
			<div ref={cardRef}>
				<Card className="relative w-[210px] aspect-[53.98/85.6] overflow-hidden bg-[#1c1c1c] text-white flex flex-col justify-around border-none rounded-none">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: "url(/bg-card.jpeg)",
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					/>
					<CardContent className="relative flex flex-col items-center justify-center p-2 space-y-2">
						<div className="bg-white p-1.5 rounded-md mb-6">
							<QRCodeSVG value={qrCodeValue} size={90} />
						</div>
						<Image
							src="/pusamada-logo.png"
							alt="Pusamada Logo"
							width={44}
							height={44}
						/>
						<p className="text-xs font-bold tracking-wider">PUSAMADA</p>
						<p className="text-[8px] leading-tight text-gray-300 text-center">
							Elmu Luhung Jembar Kabisa Budi Suci
							<br />
							Gede Bakti
						</p>

						{/* sosial media */}
						<div className="grid grid-cols-2 gap-1 text-[5px] text-gray-300 mt-4 mx-auto">
							<div className="flex items-center gap-0.5">
								<Globe className="w-2 h-2" size={5} />
								<span>www.pusamadaind.com</span>
							</div>
							<div className="flex items-center gap-0.5">
								<Music2 className="w-2 h-2" size={5} />
								<span>@pusamadaindonesia</span>
							</div>
							<div className="flex items-center gap-0.5">
								<Instagram className="w-2 h-2" size={5} />
								<span>@pusamadaindonesia</span>
							</div>
							<div className="flex items-center gap-0.5">
								<Facebook className="w-2 h-2" size={5} />
								<span>@pusakamandemuda</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="p-2 flex flex-col items-center justify-center">
				<p className="text-xs">{anggota.user.nama}</p>
				<Button
					onClick={downloadCard}
					className="w-fit bg-muted"
					variant="outline"
				>
					Download Kartu
				</Button>
			</div>
		</div>
	);
}
