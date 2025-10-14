"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { TambahAnggotaDialog } from "../tambah-anggota-dialog";

interface DataTableAnggotaProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTableAnggota<TData, TValue>({
	columns,
	data,
}: DataTableAnggotaProps<TData, TValue>) {
	return (
		<DataTable
			columns={columns}
			data={data}
			filterColumn="nama"
			filterPlaceholder="Cari berdasarkan nama..."
			toolbar={<TambahAnggotaDialog />}
		/>
	);
}
