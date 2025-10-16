"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface DataTableSeminarProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTableSeminar<TData, TValue>({
	columns,
	data,
}: DataTableSeminarProps<TData, TValue>) {
	return (
		<DataTable
			columns={columns}
			data={data}
			filterColumn="judul"
			filterPlaceholder="Cari berdasarkan judul..."
			toolbar={
				<Link href="/dashboard/seminar/tambah" className="">
					<Button>
						<Plus />
						Tambah Seminar
					</Button>
				</Link>
			}
		/>
	);
}
