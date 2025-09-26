import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTableAnggota } from "@/components/data-table-anggota";
import { SectionCards } from "@/components/section-cards";
import { Anggota } from "@/lib/schema";

async function getData(): Promise<Anggota[]> {
	// Fetch data from your API here.
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}

	const data = await res.json();
	// Filter data to only include members with role "anggota"
	const filteredData = data.filter(
		(item: Anggota) => item.user.role === "anggota"
	);
	return filteredData;
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
