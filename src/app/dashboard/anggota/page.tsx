import React from "react";
import { DataTableAnggota } from "@/components/data-table-anggota";
import { getAnggotaData } from "@/lib/anggota-api";

const PageAnggota = async () => {
	const data = await getAnggotaData();

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
