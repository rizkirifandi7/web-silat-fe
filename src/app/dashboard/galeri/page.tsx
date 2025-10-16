"use client";

import { DataTableGaleri } from "@/components/data-table/data-table-galeri";
import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { Skeleton } from "@/components/ui/skeleton";

export default function GaleriPage() {
	const { loading } = useGaleriCrud();

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
			<h1 className="text-2xl font-bold">Manajemen Galeri</h1>
			<p className="text-muted-foreground mb-4">
				Halaman ini digunakan untuk mengelola data galeri.
			</p>
			<DataTableGaleri />
		</div>
	);
}
