import { getAnggotas } from "@/lib/anggota-api";
import { AdminWelcomeSection } from "@/components/dashboard/admin-welcome-section";
import { QuickStatsEnhanced } from "@/components/dashboard/quick-stats-enhanced";
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SabukDistributionChart } from "@/components/dashboard/sabuk-distribution-chart";
import { RecentAnggota } from "@/components/recent-anggota";

export const dynamic = "force-dynamic";

export default async function PageBeranda() {
	const data = await getAnggotas();

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-6">
				<div className="flex flex-col gap-6 p-4 md:p-6">
					{/* Welcome Section */}
					<AdminWelcomeSection />

					{/* Quick Stats */}
					<QuickStatsEnhanced />

					{/* Quick Actions */}
					<QuickActionsSection />

					{/* Charts Row */}
					<div className="grid grid-cols-1 @3xl/main:grid-cols-2 gap-6">
						<ChartAreaInteractive data={data} />
						<SabukDistributionChart data={data} />
					</div>

					{/* Recent Activities & Members Row */}
					<div className="grid grid-cols-1 @3xl/main:grid-cols-2 gap-6">
						<RecentActivities anggotas={data} />
						<RecentAnggota />
					</div>
				</div>
			</div>
		</div>
	);
}

