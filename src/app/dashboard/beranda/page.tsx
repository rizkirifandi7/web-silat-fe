import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTableAnggota } from "@/components/data-table-anggota";
import { SectionCards } from "@/components/section-cards";
import { Anggota } from "@/lib/schema";

async function getData(): Promise<Anggota[]> {
	// Fetch data from your API here.
	const res = await fetch("http://localhost:8015/anggota", {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

export default async function Page() {
	const data = await getData();
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 md:gap-6 ">
					<SectionCards data={data} />
					<div className="px-4 md:px-6 gap-4 flex flex-col">
						<ChartAreaInteractive data={data} />
						<DataTableAnggota data={data} />
					</div>
				</div>
			</div>
		</div>
	);
}
