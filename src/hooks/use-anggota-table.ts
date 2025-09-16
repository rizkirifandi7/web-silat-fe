"use client";

import * as React from "react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import { Anggota } from "@/lib/schema";
import { toast } from "sonner";

export function useAnggotaTable(initialData: Anggota[]) {
	const [data, setData] = React.useState(initialData);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	React.useEffect(() => {
		setData(initialData);
	}, [initialData]);

	const handleAddAnggota = (newAnggota: Anggota) => {
		setData((prev) => [newAnggota, ...prev]);
	};

	const handleUpdateAnggota = React.useCallback(
		async (updatedAnggota: Anggota) => {
			try {
				const response = await fetch(
					`http://localhost:8015/anggota/${updatedAnggota.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(updatedAnggota),
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.message || "Gagal memperbarui data anggota."
					);
				}


const result = await response.json();
setData((prev) =>
    prev.map((anggota) =>
        // Perbaikan: Langsung gunakan 'result'
        anggota.id === result.id ? result : anggota
    )
);
toast.success("Data anggota berhasil diperbarui.");

			} catch (error) {
				console.error("Error updating anggota:", error);
				toast.error("Terjadi kesalahan saat memperbarui data anggota.");
			}
		},
		[]
	);

	const handleDeleteAnggota = React.useCallback(async (id: string) => {
		try {
			const response = await fetch(`http://localhost:8015/anggota/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal menghapus anggota.");
			}

			setData((prev) => prev.filter((anggota) => anggota.id !== id));
			toast.success("Anggota berhasil dihapus.");
		} catch (error) {
			console.error("Error deleting anggota:", error);
			toast.error("Terjadi kesalahan saat menghapus anggota.");
		}
	}, []);

	return {
		data,
		sorting,
		columnFilters,
		columnVisibility,
		setSorting,
		setColumnFilters,
		setColumnVisibility,
		handleAddAnggota,
		handleUpdateAnggota,
		handleDeleteAnggota,
	};
}
