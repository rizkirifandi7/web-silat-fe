"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Heart,
	Wallet,
	CreditCard,
	Building2,
	QrCode,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { useCampaignDetail, usePaymentMethods } from "@/hooks/use-donasi";
import { createDonation } from "@/lib/donasi-api";
import { toast } from "sonner";

// Declare Midtrans Snap
declare global {
	interface Window {
		snap?: {
			pay: (
				token: string,
				options: {
					onSuccess?: (result: unknown) => void;
					onPending?: (result: unknown) => void;
					onError?: (result: unknown) => void;
					onClose?: () => void;
				}
			) => void;
		};
	}
}

const formatRupiah = (amount: string | number) => {
	const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(numAmount);
};

const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

// Map payment method channels to icons
const channelIcons: Record<string, typeof Building2> = {
	bank_transfer: Building2,
	ewallet: Wallet,
	qris: QrCode,
	virtual_account: CreditCard,
};

export default function PaymentPage() {
	const params = useParams();
	const router = useRouter();
	const slug = params.id as string;

	// Fetch campaign and payment methods
	const { campaign, loading: campaignLoading } = useCampaignDetail(slug);
	const { paymentMethods, loading: methodsLoading } = usePaymentMethods();

	// Form states
	const [step] = useState(1);
	const [amount, setAmount] = useState(0);
	const [customAmount, setCustomAmount] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
		isAnonymous: false,
	});
	const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
		number | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Calculate admin fee based on selected payment method
	const selectedMethod = paymentMethods.find(
		(m) => m.id === selectedPaymentMethodId
	);
	const adminFee =
		amount > 0 && selectedMethod
			? selectedMethod.admin_fee_type === "fixed"
				? parseFloat(selectedMethod.admin_fee_value)
				: amount * (parseFloat(selectedMethod.admin_fee_value) / 100)
			: 0;
	const totalAmount = amount + adminFee;

	// Check if Midtrans Snap is loaded
	useEffect(() => {
		const checkSnapLoaded = () => {
			if (window.snap) {
				console.log("✅ Midtrans Snap loaded successfully");
			} else {
				console.warn("⚠️ Midtrans Snap not loaded yet");
			}
		};

		// Check immediately
		checkSnapLoaded();

		// Check again after 2 seconds
		const timer = setTimeout(checkSnapLoaded, 2000);

		return () => clearTimeout(timer);
	}, []);

	const handleAmountSelect = (value: number) => {
		setAmount(value);
		setCustomAmount("");
	};

	const handleCustomAmountChange = (value: string) => {
		const numValue = value.replace(/\D/g, "");
		setCustomAmount(numValue);
		setAmount(Number(numValue));
	};

	const handlePaymentSubmit = async () => {
		console.log("🚀 Starting payment submission...");

		// Validation
		if (!amount || amount < 10000) {
			toast.error("Minimal donasi Rp 10.000");
			return;
		}
		if (!formData.name || !formData.email || !formData.phone) {
			toast.error("Mohon lengkapi data donatur");
			return;
		}
		if (!selectedPaymentMethodId) {
			toast.error("Mohon pilih metode pembayaran");
			return;
		}
		if (!campaign) {
			toast.error("Campaign tidak ditemukan");
			return;
		}

		try {
			setIsSubmitting(true);
			console.log("✅ Validation passed, creating donation...");

			// Create donation via API
			const response = await createDonation({
				campaign_id: campaign.id,
				donor_name: formData.name,
				donor_email: formData.email,
				donor_phone: formData.phone,
				donor_message: formData.message,
				donation_amount: amount,
				payment_method_id: selectedPaymentMethodId,
				is_anonymous: formData.isAnonymous,
			});

			console.log("📦 Donation created, response:", response);
			console.log("🔑 Snap token:", response.snap_token);
			console.log("🪟 Window.snap available:", !!window.snap);

			if (!response.snap_token) {
				console.error("❌ No snap token in response");
				toast.error("Token pembayaran tidak ditemukan");
				setIsSubmitting(false);
				return;
			}

			// Check if Midtrans Snap is loaded
			if (!window.snap) {
				console.error("❌ Midtrans Snap not loaded");
				toast.error("Midtrans Snap belum dimuat. Mohon refresh halaman.");
				setIsSubmitting(false);
				return;
			}

			console.log("🎯 Opening Midtrans payment popup...");

			// Open Midtrans payment
			window.snap.pay(response.snap_token, {
				onSuccess: (result: unknown) => {
					console.log("✅ Payment success:", result);
					toast.success("Pembayaran berhasil!");
					router.push(
						`/donasi/payment/success?transaction_id=${response.transaction_id}`
					);
				},
				onPending: (result: unknown) => {
					console.log("⏳ Payment pending:", result);
					toast.info("Pembayaran menunggu konfirmasi");
					router.push(
						`/donasi/payment/success?transaction_id=${response.transaction_id}`
					);
				},
				onError: (result: unknown) => {
					console.error("❌ Payment error:", result);
					toast.error("Pembayaran gagal! Silakan coba lagi.");
					setIsSubmitting(false);
				},
				onClose: () => {
					console.log("🚪 Payment popup closed by user");
					toast.info("Popup pembayaran ditutup");
					setIsSubmitting(false);
				},
			});
		} catch (error) {
			console.error("❌ Payment submission error:", error);

			// Check if error is about missing snap_token
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			if (
				errorMessage.includes("snap_token") ||
				errorMessage.includes("Snap token")
			) {
				toast.error(
					"Sistem pembayaran belum siap. Backend belum mengintegrasikan Midtrans. " +
						"Silakan hubungi administrator.",
					{ duration: 10000 }
				);
			} else {
				toast.error("Terjadi kesalahan. Silakan coba lagi.");
			}

			setIsSubmitting(false);
		}
	};

	// Loading state
	if (campaignLoading || methodsLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!campaign) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold">Donasi tidak ditemukan</h2>
					<Button onClick={() => router.push("/donasi")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Kembali ke Donasi
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 md:py-12 bg-muted/30">
			<div className="container max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<Button
						variant="ghost"
						onClick={() => router.push(`/donasi/${campaign.slug}`)}
						className="gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Kembali
					</Button>

					{/* Progress Steps */}
					<div className="hidden md:flex items-center gap-2">
						{[1, 2, 3].map((s) => (
							<div key={s} className="flex items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
										step >= s
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
								</div>
								{s < 3 && (
									<div
										className={`w-16 h-1 mx-1 transition-colors ${
											step > s ? "bg-primary" : "bg-muted"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Step 1: Pilih Jumlah Donasi */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
										1
									</div>
									Pilih Jumlah Donasi
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Preset Amounts */}
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{presetAmounts.map((preset) => (
										<Button
											key={preset}
											variant={amount === preset ? "default" : "outline"}
											onClick={() => handleAmountSelect(preset)}
											className="h-auto py-4"
										>
											{formatRupiah(preset)}
										</Button>
									))}
								</div>

								{/* Custom Amount */}
								<div className="space-y-2">
									<Label htmlFor="customAmount">Nominal Lainnya</Label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
											Rp
										</span>
										<Input
											id="customAmount"
											type="text"
											placeholder="Masukkan nominal"
											value={
												customAmount
													? formatRupiah(Number(customAmount)).replace("Rp", "")
													: ""
											}
											onChange={(e) => handleCustomAmountChange(e.target.value)}
											className="pl-10"
										/>
									</div>
									<p className="text-xs text-muted-foreground">
										Minimal donasi Rp 10.000
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Step 2: Data Donatur */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
										2
									</div>
									Data Donatur
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">
											Nama Lengkap <span className="text-red-500">*</span>
										</Label>
										<Input
											id="name"
											placeholder="Masukkan nama lengkap"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">
											Email <span className="text-red-500">*</span>
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="email@example.com"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">
										No. WhatsApp <span className="text-red-500">*</span>
									</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="08xxxxxxxxxx"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="message">Pesan / Doa (Opsional)</Label>
									<Textarea
										id="message"
										placeholder="Tulis pesan atau doa Anda..."
										value={formData.message}
										onChange={(e) =>
											setFormData({ ...formData, message: e.target.value })
										}
										rows={4}
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="anonymous"
										checked={formData.isAnonymous}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												isAnonymous: checked as boolean,
											})
										}
									/>
									<Label
										htmlFor="anonymous"
										className="text-sm font-normal cursor-pointer"
									>
										Sembunyikan nama saya (Tampilkan sebagai Anonim)
									</Label>
								</div>
							</CardContent>
						</Card>

						{/* Step 3: Metode Pembayaran */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
										3
									</div>
									Metode Pembayaran
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{paymentMethods.map((method) => {
									const Icon = channelIcons[method.channel] || CreditCard;
									return (
										<div key={method.id} className="space-y-3">
											<Button
												variant={
													selectedPaymentMethodId === method.id
														? "default"
														: "outline"
												}
												onClick={() => {
													setSelectedPaymentMethodId(method.id);
												}}
												className="w-full justify-between gap-3 h-auto py-3"
											>
												<div className="flex items-center gap-3">
													<Icon className="w-5 h-5" />
													<div className="text-left">
														<div className="font-medium">{method.name}</div>
														{method.description && (
															<div className="text-xs text-muted-foreground">
																{method.description}
															</div>
														)}
													</div>
												</div>
												<div className="text-xs text-muted-foreground">
													Fee:{" "}
													{method.admin_fee_type === "fixed"
														? formatRupiah(method.admin_fee_value)
														: `${method.admin_fee_value}%`}
												</div>
											</Button>
										</div>
									);
								})}
								{paymentMethods.length === 0 && (
									<p className="text-center text-muted-foreground py-4">
										Tidak ada metode pembayaran tersedia
									</p>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Summary Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-20">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Ringkasan Donasi</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Campaign Info */}
									<div className="flex gap-3">
										<div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
											<Image
												src={campaign.image_url || "/silat.png"}
												alt={campaign.title}
												fill
												className="object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											{campaign.status && (
												<Badge variant="secondary" className="mb-1 text-xs">
													{campaign.status}
												</Badge>
											)}
											<h3 className="font-semibold text-sm line-clamp-2">
												{campaign.title}
											</h3>
										</div>
									</div>

									<Separator />

									{/* Amount Breakdown */}
									<div className="space-y-3">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Jumlah Donasi
											</span>
											<span className="font-medium">
												{amount > 0 ? formatRupiah(amount) : "Rp 0"}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Biaya Admin</span>
											<span className="font-medium">
												{formatRupiah(Math.round(adminFee))}
											</span>
										</div>
										<Separator />
										<div className="flex justify-between">
											<span className="font-semibold">Total Pembayaran</span>
											<span className="font-bold text-lg text-primary">
												{formatRupiah(Math.round(totalAmount))}
											</span>
										</div>
									</div>

									<Separator />

									{/* Selected Payment Info */}
									{selectedMethod && (
										<div className="p-3 bg-muted rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">
												Metode Pembayaran:
											</p>
											<p className="font-medium text-sm">
												{selectedMethod.name}
											</p>
										</div>
									)}

									{/* Submit Button */}
									<Button
										size="lg"
										className="w-full group"
										onClick={handlePaymentSubmit}
										disabled={
											!amount ||
											!formData.name ||
											!formData.email ||
											!formData.phone ||
											!selectedPaymentMethodId ||
											isSubmitting
										}
									>
										{isSubmitting ? (
											<>
												<Loader2 className="w-5 h-5 mr-2 animate-spin" />
												Memproses...
											</>
										) : (
											<>
												<Heart className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
												Lanjutkan Pembayaran
											</>
										)}
									</Button>

									<p className="text-xs text-center text-muted-foreground">
										Dengan melanjutkan, Anda menyetujui{" "}
										<span className="text-primary cursor-pointer hover:underline">
											syarat & ketentuan
										</span>{" "}
										yang berlaku
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
