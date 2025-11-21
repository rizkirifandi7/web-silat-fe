"use client";

import { useCampaignCrud } from "@/hooks/use-campaign-crud";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableCampaign } from "@/components/data-table/data-table-campaign";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Heart, TrendingUp, Users, DollarSign } from "lucide-react";

export default function DonasiPage() {
	const { loading, campaigns } = useCampaignCrud();

	// Calculate statistics
	const stats = {
		totalCampaigns: campaigns.length,
		activeCampaigns: campaigns.filter((c) => c.status === "active").length,
		totalCollected: campaigns.reduce((sum, c) => sum + c.collected_amount, 0),
		totalSupporters: campaigns.reduce((sum, c) => sum + c.total_supporters, 0),
	};

	const formatRupiah = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	if (loading) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="h-8 w-1/4 mb-4" />
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-32 w-full" />
					))}
				</div>
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10 space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Manajemen Campaign Donasi</h1>
				<p className="text-muted-foreground mt-2">
					Kelola campaign donasi, pantau progress, dan lihat statistik donasi
				</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Campaign
						</CardTitle>
						<Heart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalCampaigns}</div>
						<p className="text-xs text-muted-foreground">
							{stats.activeCampaigns} campaign aktif
						</p>
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
							{formatRupiah(stats.totalCollected)}
						</div>
						<p className="text-xs text-muted-foreground">Dari semua campaign</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Donatur</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalSupporters}</div>
						<p className="text-xs text-muted-foreground">
							Orang telah berdonasi
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Rata-rata Progress
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{campaigns.length > 0
								? (
										campaigns.reduce(
											(sum, c) =>
												sum + (c.collected_amount / c.target_amount) * 100,
											0
										) / campaigns.length
								  ).toFixed(0)
								: 0}
							%
						</div>
						<p className="text-xs text-muted-foreground">
							Dari target campaign
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Data Table */}
			<Card>
				<CardHeader>
					<CardTitle>Daftar Campaign</CardTitle>
					<CardDescription>
						Kelola semua campaign donasi dari sini
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTableCampaign />
				</CardContent>
			</Card>
		</div>
	);
}
