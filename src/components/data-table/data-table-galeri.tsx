"use client";

import * as React from "react";
import { getGaleriColumns } from "../data-table-colum/data-table-galeri-columns";
import { EditGaleriDialog } from "../edit-galeri-dialog";
import { DeleteGaleriDialog } from "../delete-dialog/delete-galeri-dialog";
import { DataTable } from "./data-table";
import { TambahGaleriDialog } from "../tambah-galeri-dialog";
import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { Galeri } from "@/lib/schema";

export function DataTableGaleri() {
	const { galeri, refreshGaleri } = useGaleriCrud();
	const [editingGaleri, setEditingGaleri] = React.useState<Galeri | null>(null);
	const [deletingGaleri, setDeletingGaleri] = React.useState<Galeri | null>(
		null
	);

	const handleEdit = (galeri: Galeri) => {
		setEditingGaleri(galeri);
	};

	const handleDelete = (galeri: Galeri) => {
		setDeletingGaleri(galeri);
	};

	const columns = React.useMemo(
		() => getGaleriColumns({ onEdit: handleEdit, onDelete: handleDelete }),
		[]
	);

	return (
		<div className="w-full">
			{editingGaleri && (
				<EditGaleriDialog
					galeri={editingGaleri}
					onSuccess={() => {
						refreshGaleri();
						setEditingGaleri(null);
					}}
					onCancel={() => setEditingGaleri(null)}
				/>
			)}
			{deletingGaleri && (
				<DeleteGaleriDialog
					galeriId={deletingGaleri.id}
					onSuccess={() => {
						refreshGaleri();
						setDeletingGaleri(null);
					}}
					onCancel={() => setDeletingGaleri(null)}
				/>
			)}
			<DataTable
				columns={columns}
				data={(galeri as Galeri[]) ?? []}
				filterColumn="judul"
				filterPlaceholder="Filter judul..."
				toolbar={<TambahGaleriDialog />}
			/>
		</div>
	);
}
