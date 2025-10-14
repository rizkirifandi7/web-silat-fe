"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { TambahAdminDialog } from "../tambah-admin-dialog";

interface DataTableAdminProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTableAdmin<TData, TValue>({
	columns,
	data,
}: DataTableAdminProps<TData, TValue>) {
	return (
		<DataTable
			columns={columns}
			data={data}
			filterColumn="nama"
			filterPlaceholder="Cari berdasarkan nama..."
			toolbar={<TambahAdminDialog />}
		/>
	);
}
