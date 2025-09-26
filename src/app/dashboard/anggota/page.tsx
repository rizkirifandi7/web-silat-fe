import React from "react";
import { Anggota } from "@/lib/schema";
import { DataTableAnggota } from "@/components/data-table-anggota";

async function getData(): Promise<Anggota[]> {
	try {
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
	} catch (error) {
		console.error("Error fetching data:", error);
		return []; // Return an empty array on error
	}
}

const PageAnggota = async () => {
	const data = await getData();

	return (
		<div className="flex flex-1 flex-col p-4 md:p-6">
			<h1 className="text-2xl font-bold">Manajemen Anggota</h1>
			<div className="">
				<DataTableAnggota data={data} />
			</div>
		</div>
	);
};

export default PageAnggota;
