"use client";

import { Anggota } from "@/lib/schema";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";

interface KartuAnggotaProps {
	anggota: Anggota;
}

export function KartuAnggota({ anggota }: KartuAnggotaProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const qrCodeValue = `${baseUrl}/verify/${anggota.id_token}`;

	const downloadCard = useCallback(() => {
		if (cardRef.current) {
			toPng(cardRef.current, { cacheBust: true, pixelRatio: 4 })
				.then((dataUrl) => {
					const link = document.createElement("a");
					link.download = `kartu-anggota-${anggota.nama_lengkap}.png`;
					link.href = dataUrl;
					link.click();
				})
				.catch((err) => {
					console.error("Gagal mengunduh kartu!", err);
				});
		}
	}, [anggota.nama_lengkap]);

	return (
		<div className="space-y-2">
			<div ref={cardRef}>
				<Card className="relative w-60 aspect-[54/85.6] overflow-hidden bg-[#1c1c1c] text-white flex flex-col justify-around">
					<div
						className="absolute inset-0 bg-repeat"
						style={{
							backgroundImage:
								"url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23333333' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
						}}
					/>
					<CardContent className="relative flex flex-col items-center justify-center p-2 space-y-2">
						<div className="bg-white p-1.5 rounded-md">
							<QRCodeSVG value={qrCodeValue} size={140} />
						</div>
						<Image
							src="/pusamada-logo.png"
							alt="Pusamada Logo"
							width={64}
							height={64}
						/>
						<p className="text-base font-bold tracking-wider">PUSAMADA</p>
						<p className="text-[10px] leading-tight text-gray-300 text-center">
							Élmu Luhung Jembar Kabisa
							<br />
							Budi Suci Gede Bakti
						</p>
					</CardContent>
				</Card>
			</div>
			<div className="p-2 flex justify-center">
				<Button
					onClick={downloadCard}
					className="w-full bg-muted"
					variant="outline"
				>
					Download Kartu
				</Button>
			</div>
		</div>
	);
}
