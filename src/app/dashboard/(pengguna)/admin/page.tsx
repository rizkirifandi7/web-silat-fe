import React from "react";
import { DataTableAdmin } from "@/components/data-table-admin";
import { getAdminData } from "@/lib/anggota-api";

const PageAdmin = async () => {
	const data = await getAdminData();

	return (
		<div className="flex flex-1 flex-col p-4 md:p-6">
			<h1 className="text-2xl font-bold">Manajemen Admin</h1>
			<div className="">
				<DataTableAdmin data={data} />
			</div>
		</div>
	);
};

export default PageAdmin;
