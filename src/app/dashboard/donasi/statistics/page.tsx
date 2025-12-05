"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchDonationStatistics, exportDonations } from "@/lib/donasi-api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowLeft,
	Download,
	TrendingUp,
	Users,
	DollarSign,
	Calendar,
	Award,
	CreditCard,
} from "lucide-react";
import { toast } from "sonner";

interface Statistics {
	summary: {
		total_donations: number;
		total_amount: number;
		average_donation: number;
	};
	status_breakdown: Array<{
		payment_status: string;
		count: number;
		amount: number;
	}>;
	top_donors: Array<{
		donor_name: string;
		donor_email: string;
		total_donated: number;
		donation_count: number;
	}>;
	payment_methods: Array<{
		payment_method_id: number;
		count: number;
		amount: number;
		paymentMethod: {
			name: string;
			channel: string;
		};
	}>;
	daily_trend: Array<{
		date: string;
		count: number;
		amount: number;
	}>;
}

export default function DonationStatisticsPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);
	const [stats, setStats] = useState<Statistics | null>(null);
	const dateRange = {
		start_date: "",
		end_date: "",
	};

	useEffect(() => {
		loadStatistics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadStatistics = async () => {
		try {
			setLoading(true);
			const data = await fetchDonationStatistics(dateRange);
			setStats(data);
		} catch (error) {
			toast.error("Gagal memuat statistik donasi");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleExport = async () => {
		try {
			setExporting(true);
			await exportDonations({
				payment_status: "settlement",
				...dateRange,
			});
			toast.success("Data berhasil diexport!");
		} catch (error) {
			toast.error("Gagal export data");
			console.error(error);
		} finally {
			setExporting(false);
		}
	};

	const formatRupiah = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			settlement: "bg-green-500",
			pending: "bg-yellow-500",
			failed: "bg-red-500",
			expire: "bg-gray-500",
			cancel: "bg-gray-500",
		};
		return colors[status] || "bg-gray-500";
	};

	if (loading) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="h-8 w-1/3 mb-6" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 w-full" />
					))}
				</div>
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="container mx-auto py-10">
				<div className="text-center text-muted-foreground">
					Data statistik tidak tersedia
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<Button
						variant="ghost"
						onClick={() => router.push("/dashboard/donasi")}
						className="mb-4"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Kembali
					</Button>
					<h1 className="text-3xl font-bold">Statistik Donasi</h1>
					<p className="text-muted-foreground mt-2">
						Analisis lengkap donasi dan donatur
					</p>
				</div>
				<Button onClick={handleExport} disabled={exporting}>
					<Download className="h-4 w-4 mr-2" />
					{exporting ? "Mengexport..." : "Export CSV"}
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.summary.total_donations}
						</div>
						<p className="text-xs text-muted-foreground">transaksi berhasil</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Terkumpul
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatRupiah(stats.summary.total_amount)}
						</div>
						<p className="text-xs text-muted-foreground">dari semua campaign</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Rata-rata Donasi
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatRupiah(stats.summary.average_donation)}
						</div>
						<p className="text-xs text-muted-foreground">per transaksi</p>
					</CardContent>
				</Card>
			</div>

			{/* Status Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>Status Donasi</CardTitle>
					<CardDescription>
						Breakdown berdasarkan status pembayaran
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.status_breakdown.map((status) => (
							<div
								key={status.payment_status}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center gap-3">
									<div
										className={`h-3 w-3 rounded-full ${getStatusColor(
											status.payment_status
										)}`}
									/>
									<div>
										<div className="font-medium capitalize">
											{status.payment_status}
										</div>
										<div className="text-sm text-muted-foreground">
											{status.count} transaksi
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-semibold">
										{formatRupiah(Number(status.amount))}
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Top Donors */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Award className="h-5 w-5 text-yellow-500" />
						<div>
							<CardTitle>Top 10 Donatur Terbesar</CardTitle>
							<CardDescription>
								Donatur paling banyak berkontribusi
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{stats.top_donors.length === 0 ? (
							<div className="text-center text-muted-foreground py-8">
								Belum ada data donatur
							</div>
						) : (
							stats.top_donors.map((donor, index) => (
								<div
									key={donor.donor_email}
									className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
											{index + 1}
										</div>
										<div>
											<div className="font-medium">{donor.donor_name}</div>
											<div className="text-sm text-muted-foreground">
												{donor.donor_email}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold">
											{formatRupiah(Number(donor.total_donated))}
										</div>
										<div className="text-xs text-muted-foreground">
											{donor.donation_count} donasi
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>

			{/* Payment Methods */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						<div>
							<CardTitle>Metode Pembayaran</CardTitle>
							<CardDescription>Distribusi metode pembayaran</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{stats.payment_methods.map((method) => (
							<div
								key={method.payment_method_id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div className="flex items-center gap-3">
									<CreditCard className="h-5 w-5 text-muted-foreground" />
									<div>
										<div className="font-medium">
											{method.paymentMethod.name}
										</div>
										<Badge variant="outline" className="text-xs">
											{method.paymentMethod.channel}
										</Badge>
									</div>
								</div>
								<div className="text-right">
									<div className="font-semibold">
										{formatRupiah(Number(method.amount))}
									</div>
									<div className="text-xs text-muted-foreground">
										{method.count} transaksi
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Daily Trend */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						<div>
							<CardTitle>Tren Donasi Harian (30 Hari Terakhir)</CardTitle>
							<CardDescription>
								Grafik perkembangan donasi per hari
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{stats.daily_trend.slice(-10).map((day) => (
							<div
								key={day.date}
								className="flex items-center justify-between p-2 border-b last:border-0"
							>
								<div className="text-sm">
									{new Date(day.date).toLocaleDateString("id-ID", {
										day: "2-digit",
										month: "short",
										year: "numeric",
									})}
								</div>
								<div className="flex items-center gap-4">
									<div className="text-sm text-muted-foreground">
										{day.count} donasi
									</div>
									<div className="font-semibold min-w-[120px] text-right">
										{formatRupiah(Number(day.amount))}
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
