"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { TambahMateriDialog } from "../tambah-materi-dialog";

interface DataTableMateriProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTableMateri<TData, TValue>({
	columns,
	data,
}: DataTableMateriProps<TData, TValue>) {
	return (
		<DataTable
			columns={columns}
			data={data}
			filterColumn="judul"
			filterPlaceholder="Cari berdasarkan judul..."
			toolbar={<TambahMateriDialog />}
		/>
	);
}
