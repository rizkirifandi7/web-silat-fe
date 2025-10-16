"use client";

import React from "react";
import { DataTableSeminar } from "@/components/data-table/data-table-seminar";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { columns } from "@/components/data-table-colum/data-table-seminar-columns";
import { Skeleton } from "@/components/ui/skeleton";

const PageSeminar = () => {
	const { seminar, loading } = useSeminarCrud();

	if (loading) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="h-8 w-1/4 mb-4" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold">Manajemen Seminar</h1>
			<p className="text-muted-foreground mb-4">
				Halaman ini digunakan untuk mengelola data seminar.
			</p>

			<div className="">
				<DataTableSeminar columns={columns} data={seminar || []} />
			</div>
		</div>
	);
};

export default PageSeminar;
