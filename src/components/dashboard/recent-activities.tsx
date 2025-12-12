"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IconClock, IconUserPlus } from "@tabler/icons-react";
import { Anggota } from "@/lib/schema";

interface Activity {
	id: string;
	type: "member" | "material" | "gallery";
	title: string;
	description: string;
	time: string;
	icon: React.ReactNode;
	color: string;
}

interface RecentActivitiesProps {
	anggotas: Anggota[];
}

export function RecentActivities({ anggotas }: RecentActivitiesProps) {
	// Get recent activities from data
	const recentMembers = anggotas
		.filter((a) => a.createdAt)
		.sort(
			(a, b) =>
				new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
		)
		.slice(0, 5);

	const activities: Activity[] = recentMembers.map((member) => ({
		id: member.id.toString(),
		type: "member",
		title: "Anggota Baru Terdaftar",
		description: `${member.nama} bergabung sebagai anggota`,
		time: formatTimeAgo(new Date(member.createdAt!)),
		icon: <IconUserPlus className="h-4 w-4" />,
		color: "bg-blue-500/10 text-blue-600",
	}));

	function formatTimeAgo(date: Date): string {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Baru saja";
		if (diffMins < 60) return `${diffMins} menit yang lalu`;
		if (diffHours < 24) return `${diffHours} jam yang lalu`;
		if (diffDays < 7) return `${diffDays} hari yang lalu`;
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}

	return (
		<Card className="shadow-none">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Aktivitas Terbaru</CardTitle>
						<CardDescription>
							Pantau aktivitas terkini di sistem
						</CardDescription>
					</div>
					<IconClock className="h-5 w-5 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{activities.length > 0 ? (
						activities.map((activity) => (
							<div
								key={activity.id}
								className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
							>
								<div className={`rounded-lg p-2 ${activity.color}`}>
									{activity.icon}
								</div>
								<div className="flex-1 space-y-1 min-w-0">
									<div className="flex items-start justify-between gap-2">
										<p className="text-sm font-medium leading-none">
											{activity.title}
										</p>
										<span
											className="text-xs text-muted-foreground whitespace-nowrap"
											suppressHydrationWarning
										>
											{activity.time}
										</span>
									</div>
									<p className="text-sm text-muted-foreground truncate">
										{activity.description}
									</p>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-8 text-muted-foreground">
							<p>Belum ada aktivitas terbaru</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
