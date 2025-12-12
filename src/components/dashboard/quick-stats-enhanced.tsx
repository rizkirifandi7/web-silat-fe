import {
	IconUsers,
	IconUserCheck,
	IconBook,
	IconTrendingUp,
	IconTrendingDown,
	IconMinus,
	IconCashBanknote,
} from "@tabler/icons-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAnggotas } from "@/lib/anggota-api";
import { getKategoriMateri } from "@/lib/kategori-materi-api";
import { getGaleri } from "@/lib/galeri-api";
import { getAllCampaigns } from "@/lib/campaign-api";
import { Anggota } from "@/lib/schema";

interface StatCardProps {
	title: string;
	value: number;
	change?: number;
	changeLabel?: string;
	icon: React.ReactNode;
	trend?: "up" | "down" | "neutral";
	colorClass?: string;
}

function StatCard({
	title,
	value,
	change,
	changeLabel,
	icon,
	trend,
	colorClass = "text-primary",
}: StatCardProps) {
	const getTrendIcon = () => {
		if (trend === "up") return <IconTrendingUp className="h-3 w-3" />;
		if (trend === "down") return <IconTrendingDown className="h-3 w-3" />;
		return <IconMinus className="h-3 w-3" />;
	};

	const getTrendColor = () => {
		if (trend === "up")
			return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400";
		if (trend === "down")
			return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400";
		return "text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400";
	};

	return (
		<Card className="overflow-hidden shadow-none border">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardDescription className="text-sm font-medium">
						{title}
					</CardDescription>
					<div className={`rounded-lg bg-primary/10 p-2 ${colorClass}`}>
						{icon}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					<CardTitle className="text-3xl font-bold tabular-nums">
						{value.toLocaleString()}
					</CardTitle>
					{change !== undefined && (
						<Badge
							variant="secondary"
							className={`text-xs font-medium ${getTrendColor()}`}
						>
							{getTrendIcon()}
							<span className="ml-1">
								{change > 0 ? "+" : ""}
								{change}% {changeLabel || "dari bulan lalu"}
							</span>
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export async function QuickStatsEnhanced() {
	const [dataAnggota, dataMateri, , dataCampaigns] = await Promise.all([
		getAnggotas(),
		getKategoriMateri(),
		getGaleri(),
		getAllCampaigns().catch(() => []),
	]);

	const totalAnggota = dataAnggota.length;
	const anggotaAktif = dataAnggota.filter(
		(anggota: Anggota) => anggota.status_keanggotaan === "Aktif"
	).length;

	// Calculate growth (simulasi - bisa diganti dengan data real)
	const anggotaBulanIni = dataAnggota.filter((anggota: Anggota) => {
		if (!anggota.createdAt) return false;
		const date = new Date(anggota.createdAt);
		const now = new Date();
		return (
			date.getMonth() === now.getMonth() &&
			date.getFullYear() === now.getFullYear()
		);
	}).length;

	const anggotaBulanLalu = dataAnggota.filter((anggota: Anggota) => {
		if (!anggota.createdAt) return false;
		const date = new Date(anggota.createdAt);
		const now = new Date();
		const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
		return (
			date.getMonth() === lastMonth.getMonth() &&
			date.getFullYear() === lastMonth.getFullYear()
		);
	}).length;

	const growthPercentage =
		anggotaBulanLalu > 0
			? Math.round(
					((anggotaBulanIni - anggotaBulanLalu) / anggotaBulanLalu) * 100
			  )
			: 0;

	const totalMateri = dataMateri.length;
	const campaigns = Array.isArray(dataCampaigns) ? dataCampaigns : [];
	const activeCampaigns = campaigns.filter(
		(c: { status?: string }) => c.status === "active"
	).length;

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="Total Anggota"
				value={totalAnggota}
				change={growthPercentage}
				icon={<IconUsers className="h-5 w-5" />}
				trend={
					growthPercentage > 0
						? "up"
						: growthPercentage < 0
						? "down"
						: "neutral"
				}
				colorClass="text-blue-600"
			/>
			<StatCard
				title="Anggota Aktif"
				value={anggotaAktif}
				change={Math.round((anggotaAktif / totalAnggota) * 100)}
				changeLabel="dari total"
				icon={<IconUserCheck className="h-5 w-5" />}
				trend="up"
				colorClass="text-green-600"
			/>
			<StatCard
				title="Total Materi"
				value={totalMateri}
				icon={<IconBook className="h-5 w-5" />}
				colorClass="text-purple-600"
			/>
			<StatCard
				title="Kampanye Aktif"
				value={activeCampaigns}
				icon={<IconCashBanknote className="h-5 w-5" />}
				colorClass="text-orange-600"
			/>
		</div>
	);
}
