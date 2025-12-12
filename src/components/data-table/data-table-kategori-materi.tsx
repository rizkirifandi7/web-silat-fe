"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";

interface DataTableKategoriMateriProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTableKategoriMateri<TData, TValue>({
	columns,
	data,
}: DataTableKategoriMateriProps<TData, TValue>) {
	return (
		<DataTable
			columns={columns}
			data={data}
			filterColumn="judul"
			filterPlaceholder="Cari berdasarkan judul kategori..."
		/>
	);
}

