"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import TambahKategoriMateriDialog from "../tambah-kategori-materi-dialog";

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
			filterColumn="nama"
			filterPlaceholder="Cari berdasarkan nama..."
			toolbar={<TambahKategoriMateriDialog />}
		/>
	);
}
