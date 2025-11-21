"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle2,
	Download,
	Share2,
	Home,
	ArrowRight,
	Clock,
	Calendar,
	Wallet,
	Loader2,
} from "lucide-react";
import { checkDonationStatus } from "@/lib/donasi-api";
import type { DonationStatus } from "@/types/donasi";
import { toast } from "sonner";

const formatRupiah = (amount: string | number) => {
	const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(numAmount);
};

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams();
	const [donation, setDonation] = useState<DonationStatus | null>(null);
	const [loading, setLoading] = useState(true);

	const transactionId = searchParams.get("transaction_id");
	const [pollingCount, setPollingCount] = useState(0);

	// Fetch donation status with polling for VA number
	useEffect(() => {
		const fetchStatus = async () => {
			if (!transactionId) {
				setLoading(false);
				return;
			}

			try {
				console.log(
					`🔄 Fetching donation status (attempt ${pollingCount + 1}/15)...`
				);
				const response = await checkDonationStatus(transactionId);
				console.log("📦 Check Status Response:", response);

				if (response.status === "success" && response.data?.donation) {
					const donationData = response.data.donation;
					console.log("💳 Donation Data:", donationData);
					console.log("💰 Payment Status:", donationData.payment_status);
					console.log("🏦 VA Numbers:", donationData.va_numbers);
					console.log("🔢 Payment Code:", donationData.payment_code);
					console.log("🔗 QR Code URL:", donationData.qr_code_url);
					console.log("📱 Deeplink:", donationData.deeplink_redirect);

					setDonation(donationData);

					// Check if we need to continue polling
					const isPendingPayment =
						donationData.payment_status === "pending" ||
						donationData.payment_status === "authorize";

					const hasPaymentDetails =
						(donationData.va_numbers && donationData.va_numbers.length > 0) ||
						donationData.payment_code ||
						donationData.qr_code_url ||
						donationData.deeplink_redirect ||
						donationData.bill_key ||
						donationData.biller_code;

					// Continue polling if payment is pending and no payment details yet
					if (isPendingPayment && !hasPaymentDetails && pollingCount < 15) {
						console.log(
							"⏳ Payment details not available yet, retrying in 2 seconds..."
						);
						setTimeout(() => {
							setPollingCount((prev) => prev + 1);
						}, 2000);
					} else {
						if (hasPaymentDetails) {
							console.log("✅ Payment details loaded successfully!");
						} else if (pollingCount >= 15) {
							console.warn(
								"⚠️ Max polling attempts reached. Payment details may be sent via email."
							);
						}
						setLoading(false);
					}
				} else {
					console.error("❌ Invalid response structure:", response);
					setLoading(false);
				}
			} catch (error) {
				console.error("❌ Error fetching donation status:", error);
				if (pollingCount < 15) {
					console.log("🔄 Retrying after error...");
					setTimeout(() => {
						setPollingCount((prev) => prev + 1);
					}, 2000);
				} else {
					setLoading(false);
				}
			}
		};

		fetchStatus();
	}, [transactionId, pollingCount]);

	const handleDownloadReceipt = () => {
		// Implementasi download receipt
		alert("Fitur download receipt akan segera tersedia");
	};

	const handleShare = () => {
		if (!donation) return;

		// Implementasi share
		if (navigator.share) {
			navigator.share({
				title: "Saya Baru Saja Berdonasi!",
				text: `Saya baru saja berdonasi ${formatRupiah(
					donation.donation_amount
				)} untuk ${donation.campaign.title}. Mari berbuat baik bersama!`,
				url: window.location.origin + "/donasi",
			});
		} else {
			alert("Fitur share tidak tersedia di browser ini");
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	// Error state
	if (!transactionId || !donation) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<CardContent className="p-8 text-center">
						<h2 className="text-2xl font-bold mb-4">
							Transaksi Tidak Ditemukan
						</h2>
						<p className="text-muted-foreground mb-6">
							Maaf, kami tidak dapat menemukan detail transaksi Anda.
						</p>
						<Button asChild>
							<Link href="/donasi">Kembali ke Donasi</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 md:py-12 bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
			<div className="container max-w-4xl mx-auto px-4">
				{/* Success/Pending Animation */}
				<div className="text-center mb-8 animate-fade-in-up">
					<div
						className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
							donation.payment_status === "settlement" ||
							donation.payment_status === "success"
								? "bg-green-100 dark:bg-green-900/30"
								: "bg-yellow-100 dark:bg-yellow-900/30"
						}`}
					>
						{donation.payment_status === "settlement" ||
						donation.payment_status === "success" ? (
							<CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
						) : (
							<Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
						)}
					</div>
					<h1 className="text-3xl md:text-4xl font-bold mb-2">
						{donation.payment_status === "settlement" ||
						donation.payment_status === "success"
							? "Pembayaran Berhasil!"
							: "Menunggu Pembayaran"}
					</h1>
					<p className="text-muted-foreground text-lg">
						{donation.payment_status === "settlement" ||
						donation.payment_status === "success"
							? "Terima kasih atas donasi Anda"
							: "Silakan selesaikan pembayaran Anda"}
					</p>
				</div>

				{/* Transaction Details */}
				<Card
					className="mb-6 animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					<CardContent className="p-6 md:p-8">
						<div className="space-y-6">
							{/* Transaction ID */}
							<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										ID Transaksi
									</p>
									<p className="font-mono font-semibold">
										{donation.transaction_id}
									</p>
								</div>
								<Badge
									variant="default"
									className={
										donation.payment_status === "settlement"
											? "bg-green-600"
											: "bg-yellow-600"
									}
								>
									{donation.payment_status === "settlement"
										? "Berhasil"
										: "Pending"}
								</Badge>
							</div>{" "}
							<Separator />
							{/* Campaign Info */}
							<div>
								<p className="text-sm text-muted-foreground mb-2">
									Donasi Untuk
								</p>
								<p className="font-semibold text-lg">
									{donation.campaign.title}
								</p>
							</div>{" "}
							<Separator />
							{/* Payment Details Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-start gap-3 p-4 border rounded-lg">
									<Wallet className="w-5 h-5 text-primary mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">
											Jumlah Donasi
										</p>
										<p className="font-bold text-xl text-primary">
											{formatRupiah(donation.donation_amount)}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3 p-4 border rounded-lg">
									<CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">
											Metode Pembayaran
										</p>
										<p className="font-semibold">{donation.payment_method}</p>
									</div>
								</div>
								<div className="flex items-start gap-3 p-4 border rounded-lg">
									<Calendar className="w-5 h-5 text-primary mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">Tanggal</p>
										<p className="font-semibold">
											{new Date().toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3 p-4 border rounded-lg">
									<Clock className="w-5 h-5 text-primary mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">Waktu</p>
										<p className="font-semibold">
											{new Date().toLocaleTimeString("id-ID", {
												hour: "2-digit",
												minute: "2-digit",
											})}{" "}
											WIB
										</p>
									</div>
								</div>
							</div>
							<Separator />
							{/* VA Number / Payment Code Display */}
							{(donation.payment_status === "pending" ||
								donation.payment_status === "authorize") && (
								<>
									{/* Loading state for payment details */}
									{!donation.va_numbers &&
										!donation.payment_code &&
										!donation.qr_code_url &&
										!donation.deeplink_redirect &&
										!donation.bill_key &&
										pollingCount < 15 && (
											<div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-6">
												<div className="text-center">
													<Loader2 className="w-8 h-8 animate-spin text-yellow-600 mx-auto mb-3" />
													<p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
														Sedang memuat detail pembayaran...
													</p>
													<p className="text-xs text-yellow-800 dark:text-yellow-200">
														Mohon tunggu sebentar ({pollingCount + 1}/15), kami
														sedang memproses informasi pembayaran dari Midtrans.
													</p>
												</div>
											</div>
										)}

									{/* Fallback message if payment details still not available after polling */}
									{!donation.va_numbers &&
										!donation.payment_code &&
										!donation.qr_code_url &&
										!donation.deeplink_redirect &&
										!donation.bill_key &&
										pollingCount >= 15 && (
											<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
												<div className="text-center">
													<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
														📧 Detail Pembayaran Dikirim via Email
													</p>
													<p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
														Nomor Virtual Account dan instruksi pembayaran telah
														dikirim ke email Anda. Silakan cek inbox atau folder
														spam.
													</p>
													<p className="text-xs text-muted-foreground">
														ID Transaksi:{" "}
														<span className="font-mono">
															{donation.transaction_id}
														</span>
													</p>
												</div>
											</div>
										)}

									{/* Virtual Account Number */}
									{donation.va_numbers && donation.va_numbers.length > 0 && (
										<div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-6">
											<div className="text-center">
												<p className="text-sm font-semibold text-muted-foreground mb-2">
													Nomor Virtual Account
												</p>
												<p className="text-xs text-muted-foreground mb-1">
													{donation.va_numbers[0].bank.toUpperCase()}
												</p>
												<div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-3">
													<p className="font-mono text-3xl font-bold text-primary tracking-wider">
														{donation.va_numbers[0].va_number}
													</p>
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														navigator.clipboard.writeText(
															donation.va_numbers![0].va_number
														);
														toast.success("Nomor VA berhasil disalin!");
													}}
												>
													📋 Salin Nomor VA
												</Button>
											</div>
										</div>
									)}

									{/* QR Code (for QRIS/GoPay/etc) */}
									{donation.qr_code_url && (
										<div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-6">
											<div className="text-center">
												<p className="text-sm font-semibold text-muted-foreground mb-3">
													Scan QR Code untuk Pembayaran
												</p>
												<div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-3 inline-block">
													<Image
														src={donation.qr_code_url}
														alt="QR Code"
														width={256}
														height={256}
														className="mx-auto"
														unoptimized
													/>
												</div>
												<p className="text-xs text-muted-foreground">
													Buka aplikasi pembayaran Anda dan scan QR code di atas
												</p>
											</div>
										</div>
									)}

									{/* Deeplink (for GoPay/OVO/etc) */}
									{donation.deeplink_redirect && (
										<div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-6">
											<div className="text-center">
												<p className="text-sm font-semibold text-muted-foreground mb-3">
													Bayar dengan Aplikasi
												</p>
												<Button
													size="lg"
													className="w-full"
													onClick={() => {
														window.location.href = donation.deeplink_redirect!;
													}}
												>
													📱 Buka Aplikasi Pembayaran
												</Button>
												<p className="text-xs text-muted-foreground mt-3">
													Anda akan diarahkan ke aplikasi pembayaran
												</p>
											</div>
										</div>
									)}

									{/* Payment Code (for convenience store) */}
									{donation.payment_code && (
										<div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-6">
											<div className="text-center">
												<p className="text-sm font-semibold text-muted-foreground mb-2">
													Kode Pembayaran
												</p>
												<div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-3">
													<p className="font-mono text-3xl font-bold text-primary tracking-wider">
														{donation.payment_code}
													</p>
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														navigator.clipboard.writeText(
															donation.payment_code!
														);
														toast.success("Kode pembayaran berhasil disalin!");
													}}
												>
													📋 Salin Kode
												</Button>
											</div>
										</div>
									)}

									{/* Total Amount to Pay */}
									<div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
										<div className="flex justify-between items-center">
											<p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
												Total yang Harus Dibayar:
											</p>
											<p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
												{formatRupiah(donation.total_amount)}
											</p>
										</div>
										{donation.expiry_time && (
											<p className="text-xs text-yellow-800 dark:text-yellow-200 mt-2">
												⏰ Selesaikan pembayaran sebelum:{" "}
												{new Date(donation.expiry_time).toLocaleString("id-ID")}
											</p>
										)}
									</div>

									{/* Payment Instructions */}
									{(donation.va_numbers ||
										donation.payment_code ||
										donation.qr_code_url ||
										donation.deeplink_redirect) && (
										<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
											<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
												📝 Cara Pembayaran:
											</p>
											<ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
												{donation.va_numbers &&
													donation.va_numbers.length > 0 && (
														<>
															<li>
																Buka aplikasi mobile banking atau ATM{" "}
																{donation.va_numbers[0].bank.toUpperCase()}
															</li>
															<li>Pilih menu Transfer / Bayar</li>
															<li>Pilih ke rekening Virtual Account</li>
															<li>
																Masukkan nomor VA:{" "}
																<span className="font-mono font-bold">
																	{donation.va_numbers[0].va_number}
																</span>
															</li>
															<li>
																Masukkan nominal:{" "}
																<span className="font-bold">
																	{formatRupiah(donation.total_amount)}
																</span>
															</li>
															<li>Konfirmasi dan selesaikan pembayaran</li>
														</>
													)}
												{donation.qr_code_url && (
													<>
														<li>
															Buka aplikasi pembayaran Anda (GoPay/OVO/DANA/dll)
														</li>
														<li>Pilih menu Scan QR atau QRIS</li>
														<li>Scan QR Code yang ditampilkan di atas</li>
														<li>Konfirmasi pembayaran di aplikasi</li>
													</>
												)}
												{donation.deeplink_redirect &&
													!donation.qr_code_url && (
														<>
															<li>
																Klik tombol &quot;Buka Aplikasi Pembayaran&quot;
																di atas
															</li>
															<li>
																Anda akan diarahkan ke aplikasi{" "}
																{donation.payment_method}
															</li>
															<li>Konfirmasi detail pembayaran</li>
															<li>Selesaikan pembayaran di aplikasi</li>
														</>
													)}
												{donation.payment_code && (
													<>
														<li>Kunjungi {donation.payment_method} terdekat</li>
														<li>
															Berikan kode pembayaran:{" "}
															<span className="font-mono font-bold">
																{donation.payment_code}
															</span>
														</li>
														<li>
															Lakukan pembayaran sejumlah:{" "}
															<span className="font-bold">
																{formatRupiah(donation.total_amount)}
															</span>
														</li>
														<li>Simpan bukti pembayaran</li>
													</>
												)}
											</ol>
										</div>
									)}
								</>
							)}
							{/* Success Info Message */}
							{(donation.payment_status === "settlement" ||
								donation.payment_status === "success") && (
								<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
									<p className="text-sm text-blue-800 dark:text-blue-200">
										📧 Bukti pembayaran dan detail donasi telah dikirim ke email
										Anda. Silakan cek inbox atau folder spam Anda.
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div
					className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 animate-fade-in-up"
					style={{ animationDelay: "0.2s" }}
				>
					<Button
						variant="outline"
						size="lg"
						onClick={handleDownloadReceipt}
						className="w-full"
					>
						<Download className="w-4 h-4 mr-2" />
						Unduh Bukti
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={handleShare}
						className="w-full"
					>
						<Share2 className="w-4 h-4 mr-2" />
						Bagikan
					</Button>
				</div>

				{/* Navigation */}
				<div
					className="space-y-3 animate-fade-in-up"
					style={{ animationDelay: "0.3s" }}
				>
					<Link href="/donasi">
						<Button size="lg" className="w-full group">
							<Home className="w-4 h-4 mr-2" />
							Lihat Program Donasi Lainnya
							<ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
						</Button>
					</Link>
				</div>

				{/* Thank You Message */}
				<Card
					className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 animate-fade-in-up"
					style={{ animationDelay: "0.4s" }}
				>
					<CardContent className="p-6 text-center">
						<h3 className="font-semibold text-lg mb-2">
							Terima Kasih atas Kebaikan Anda! 🙏
						</h3>
						<p className="text-sm text-muted-foreground">
							Donasi Anda sangat berarti dan akan digunakan sebaik-baiknya untuk
							program{" "}
							<span className="font-semibold">{donation.campaign.title}</span>.
							Semoga Allah SWT membalas kebaikan Anda dengan berlipat ganda.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
