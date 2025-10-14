"use client";
import { useParams } from "next/navigation";
import { useMateriCRUD } from "@/hooks/use-materi-crud";
import { DataTableMateri } from "@/components/data-table/data-table-materi";
import { columns } from "@/components/data-table-colum/data-table-materi-columns";

export default function DetailMateriPage() {
	const { id } = useParams();
	const { materi, isLoading, isError } = useMateriCRUD(id as string);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error fetching data</div>;

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-2">Daftar Materi</h1>
			{materi && <DataTableMateri columns={columns} data={materi} />}
		</div>
	);
}
