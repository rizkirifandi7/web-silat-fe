import { SectionCards } from "@/components/section-cards";
import { RecentAnggota } from "@/components/recent-anggota";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { getAnggotas } from "@/lib/anggota-api";

export const dynamic = "force-dynamic";

export default async function PageBeranda() {
	const data = await getAnggotas();
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 md:gap-6 ">
					<SectionCards />
					<div className="px-4 md:px-6 gap-4 grid grid-cols-1 @3xl/main:grid-cols-2">
						<ChartAreaInteractive data={data} />
						<RecentAnggota />
					</div>
				</div>
			</div>
		</div>
	);
}
