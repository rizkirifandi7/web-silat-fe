"use client";

import { useState, useMemo } from "react";
import { Anggota } from "@/lib/schema";
import { toast } from "sonner";

// Mendefinisikan tipe untuk state dialog, membuatnya lebih terstruktur
export type DialogState =
	| { type: "add" }
	| { type: "edit"; anggota: Anggota }
	| { type: "delete"; anggota: Anggota }
	| { type: "view"; anggota: Anggota }
	| { type: "card"; anggota: Anggota }
	| null;

/**
 * Hook untuk mengelola state dan logika CRUD untuk tabel Anggota.
 * @param initialData - Data awal anggota.
 */
export function useAnggotaCRUD(initialData: Anggota[]) {
	const [data, setData] = useState<Anggota[]>(initialData);
	const [dialog, setDialog] = useState<DialogState>(null);

	// Handler untuk menambahkan anggota baru ke state (optimistic update)
	const handleAdd = (newAnggota: Anggota) => {
		setData((currentData) => [newAnggota, ...currentData]);
		toast.success("Anggota baru berhasil ditambahkan!");
		setDialog(null); // Tutup dialog setelah berhasil
	};

	// Handler untuk memperbarui anggota di state (optimistic update)
	const handleUpdate = (updatedAnggota: Anggota) => {
		setData((currentData) =>
			currentData.map((a) => (a.id === updatedAnggota.id ? updatedAnggota : a)),
		);
		toast.success("Data anggota berhasil diperbarui!");
		setDialog(null); // Tutup dialog setelah berhasil
	};

	// Handler untuk menghapus anggota
	const handleDelete = async (id: string) => {
		const originalData = data;
		// Optimistic update: Hapus data dari UI terlebih dahulu
		setData((currentData) => currentData.filter((a) => a.id !== id));
		setDialog(null); // Tutup dialog konfirmasi

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal menghapus anggota.");
			}

			toast.success("Anggota berhasil dihapus.");
		} catch (error) {
			// Rollback jika terjadi error
			setData(originalData);
			toast.error(
				error instanceof Error ? error.message : "Gagal menghapus anggota.",
			);
		}
	};

	// Kumpulan aksi untuk mengontrol dialog, dibungkus dengan useMemo untuk efisiensi
	const actions = useMemo(
		() => ({
			openAdd: () => setDialog({ type: "add" }),
			openEdit: (anggota: Anggota) => setDialog({ type: "edit", anggota }),
			openDelete: (anggota: Anggota) => setDialog({ type: "delete", anggota }),
			openView: (anggota: Anggota) => setDialog({ type: "view", anggota }),
			openCard: (anggota: Anggota) => setDialog({ type: "card", anggota }),
			close: () => setDialog(null),
		}),
		[],
	);

	return {
		data,
		dialog,
		actions,
		handleAdd,
		handleUpdate,
		handleDelete,
	};
}
