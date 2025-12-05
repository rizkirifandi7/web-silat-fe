"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchDonorsByCampaign, fetchCampaignById } from "@/lib/donasi-api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowLeft,
	User,
	Mail,
	Phone,
	MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface Donor {
	id: number;
	donor_name: string;
	donor_email: string;
	donor_phone: string;
	donation_amount: number;
	admin_fee: number;
	total_amount: number;
	donor_message: string;
	is_anonymous: boolean;
	payment_status: string;
	transaction_id: string;
	created_at: string;
	paymentMethod: {
		name: string;
		channel: string;
	};
}

export default function CampaignDonorsPage() {
	const params = useParams();
	const router = useRouter();
	const campaignId = params.id as string;

	const [loading, setLoading] = useState(true);
	const [campaignTitle, setCampaignTitle] = useState("");
	const [donors, setDonors] = useState<Donor[]>([]);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 50,
		total_pages: 0,
	});

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [campaignId, pagination.page]);

	const loadData = async () => {
		try {
			setLoading(true);

			// Fetch campaign detail
			const campaign = await fetchCampaignById(campaignId);
			setCampaignTitle(campaign.title);

			// Fetch donors
			const result = await fetchDonorsByCampaign(campaignId, {
				page: pagination.page,
				limit: pagination.limit,
				payment_status: "settlement",
			});

			setDonors(result.donors || []);
			if (result.pagination) {
				setPagination(result.pagination);
			}
		} catch (error) {
			toast.error("Gagal memuat data donatur");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const formatRupiah = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="h-8 w-1/3 mb-6" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			{/* Header */}
			<div className="mb-6">
				<Button
					variant="ghost"
					onClick={() => router.push("/dashboard/donasi")}
					className="mb-4"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Kembali
				</Button>
				<h1 className="text-3xl font-bold">Daftar Donatur</h1>
				<p className="text-muted-foreground mt-2">
					Campaign: <span className="font-semibold">{campaignTitle}</span>
				</p>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Donatur</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{pagination.total}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatRupiah(
								donors.reduce((sum, d) => sum + d.donation_amount, 0)
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">
							Rata-rata Donasi
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatRupiah(
								donors.length > 0
									? donors.reduce((sum, d) => sum + d.donation_amount, 0) /
											donors.length
									: 0
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Donors Table */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Daftar Donatur</CardTitle>
							<CardDescription>
								Menampilkan {donors.length} dari {pagination.total} donatur
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tanggal</TableHead>
								<TableHead>Donatur</TableHead>
								<TableHead>Kontak</TableHead>
								<TableHead>Jumlah</TableHead>
								<TableHead>Payment</TableHead>
								<TableHead>Pesan</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{donors.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										<div className="text-muted-foreground">
											Belum ada donatur untuk campaign ini
										</div>
									</TableCell>
								</TableRow>
							) : (
								donors.map((donor) => (
									<TableRow key={donor.id}>
										<TableCell className="whitespace-nowrap">
											{formatDate(donor.created_at)}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<User className="h-4 w-4 text-muted-foreground" />
												<div>
													<div className="font-medium">{donor.donor_name}</div>
													{donor.is_anonymous && (
														<Badge variant="secondary" className="text-xs">
															Anonim
														</Badge>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1 text-sm">
												<div className="flex items-center gap-2">
													<Mail className="h-3 w-3 text-muted-foreground" />
													{donor.donor_email}
												</div>
												{donor.donor_phone && (
													<div className="flex items-center gap-2">
														<Phone className="h-3 w-3 text-muted-foreground" />
														{donor.donor_phone}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-semibold">
												{formatRupiah(donor.donation_amount)}
											</div>
											<div className="text-xs text-muted-foreground">
												Admin: {formatRupiah(donor.admin_fee)}
											</div>
										</TableCell>
										<TableCell>
											<div className="text-sm">
												<div>{donor.paymentMethod.name}</div>
												<Badge variant="outline" className="text-xs">
													{donor.paymentMethod.channel}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											{donor.donor_message ? (
												<div className="flex items-start gap-2 max-w-xs">
													<MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
													<div className="text-sm text-muted-foreground truncate">
														{donor.donor_message}
													</div>
												</div>
											) : (
												<span className="text-xs text-muted-foreground">-</span>
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>

					{/* Pagination */}
					{pagination.total_pages > 1 && (
						<div className="flex items-center justify-between mt-4">
							<div className="text-sm text-muted-foreground">
								Halaman {pagination.page} dari {pagination.total_pages}
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
									}
									disabled={pagination.page === 1}
								>
									Sebelumnya
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
									}
									disabled={pagination.page === pagination.total_pages}
								>
									Selanjutnya
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
