"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	XCircle,
	ArrowLeft,
	RefreshCcw,
	Home,
	AlertCircle,
	Phone,
	Mail,
} from "lucide-react";

const formatRupiah = (amount: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(amount);
};

export default function PaymentFailedPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const amount = searchParams.get("amount");
	const method = searchParams.get("method");
	const campaign = searchParams.get("campaign");
	const reason = searchParams.get("reason") || "Pembayaran dibatalkan";

	const handleRetry = () => {
		router.back();
	};

	return (
		<div className="min-h-screen py-8 md:py-12 bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20">
			<div className="container max-w-4xl mx-auto px-4">
				{/* Failed Animation */}
				<div className="text-center mb-8 animate-fade-in-up">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
						<XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
					</div>
					<h1 className="text-3xl md:text-4xl font-bold mb-2">
						Pembayaran Gagal
					</h1>
					<p className="text-muted-foreground text-lg">
						Maaf, transaksi Anda tidak dapat diproses
					</p>
				</div>

				{/* Error Details */}
				<Card
					className="mb-6 border-red-200 dark:border-red-900 animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					<CardContent className="p-6 md:p-8">
						<div className="space-y-6">
							{/* Error Message */}
							<div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
								<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-semibold text-red-800 dark:text-red-200 mb-1">
										Alasan Kegagalan
									</p>
									<p className="text-sm text-red-700 dark:text-red-300">
										{reason}
									</p>
								</div>
							</div>

							<Separator />

							{/* Transaction Info */}
							<div>
								<p className="text-sm text-muted-foreground mb-2">
									Donasi Untuk
								</p>
								<p className="font-semibold text-lg">{campaign}</p>
							</div>

							{amount && method && (
								<>
									<Separator />
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="p-4 border rounded-lg">
											<p className="text-sm text-muted-foreground mb-1">
												Jumlah
											</p>
											<p className="font-bold text-lg">
												{formatRupiah(Number(amount))}
											</p>
										</div>
										<div className="p-4 border rounded-lg">
											<p className="text-sm text-muted-foreground mb-1">
												Metode
											</p>
											<p className="font-semibold">{method}</p>
										</div>
									</div>
								</>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Possible Solutions */}
				<Card
					className="mb-6 animate-fade-in-up"
					style={{ animationDelay: "0.2s" }}
				>
					<CardContent className="p-6">
						<h3 className="font-semibold mb-4 flex items-center gap-2">
							<AlertCircle className="w-5 h-5 text-primary" />
							Kemungkinan Penyebab & Solusi
						</h3>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">•</span>
								<span>
									<strong>Saldo tidak mencukupi:</strong> Pastikan saldo atau
									limit kartu Anda mencukupi
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">•</span>
								<span>
									<strong>Koneksi internet terputus:</strong> Periksa koneksi
									internet Anda dan coba lagi
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">•</span>
								<span>
									<strong>Data tidak valid:</strong> Periksa kembali data
									pembayaran yang Anda masukkan
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-0.5">•</span>
								<span>
									<strong>Timeout:</strong> Transaksi melebihi batas waktu yang
									ditentukan
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div
					className="space-y-3 animate-fade-in-up"
					style={{ animationDelay: "0.3s" }}
				>
					<Button size="lg" className="w-full group" onClick={handleRetry}>
						<RefreshCcw className="w-4 h-4 mr-2" />
						Coba Lagi
					</Button>
					<Link href="/donasi">
						<Button variant="outline" size="lg" className="w-full">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Kembali ke Donasi
						</Button>
					</Link>
					<Link href="/">
						<Button variant="ghost" size="lg" className="w-full">
							<Home className="w-4 h-4 mr-2" />
							Kembali ke Beranda
						</Button>
					</Link>
				</div>

				{/* Support Contact */}
				<Card
					className="mt-6 bg-muted/50 animate-fade-in-up"
					style={{ animationDelay: "0.4s" }}
				>
					<CardContent className="p-6">
						<h3 className="font-semibold mb-3">Butuh Bantuan?</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Jika masalah terus berlanjut, silakan hubungi tim dukungan kami:
						</p>
						<div className="space-y-2">
							<div className="flex items-center gap-3 text-sm">
								<Phone className="w-4 h-4 text-primary" />
								<span>WhatsApp: +62 812-3456-7890</span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<Mail className="w-4 h-4 text-primary" />
								<span>Email: support@pencaksilat.org</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
