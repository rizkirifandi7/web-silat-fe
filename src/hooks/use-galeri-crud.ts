"use client";

import { useState, useEffect, useCallback } from "react";
import {
	getGaleri,
	createGaleri,
	updateGaleri,
	deleteGaleri,
} from "@/lib/galeri-api";
import { Galeri } from "@/lib/schema";
import { toast } from "sonner";

export function useGaleriCrud() {
	const [galeri, setGaleri] = useState<Galeri[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const refreshGaleri = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getGaleri();
			setGaleri(data);
		} catch (err) {
			setError(err as Error);
			toast.error("Gagal memuat data galeri.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshGaleri();
	}, [refreshGaleri]);

	const addGaleri = async (formData: FormData) => {
		try {
			await createGaleri(formData);
			toast.success("Galeri berhasil ditambahkan.");
			await refreshGaleri();
		} catch (err) {
			setError(err as Error);
			toast.error((err as Error).message || "Gagal menambahkan galeri.");
		}
	};

	const editGaleri = async (id: number, formData: FormData) => {
		try {
			await updateGaleri(id, formData);
			toast.success("Galeri berhasil diperbarui.");
			await refreshGaleri();
		} catch (err) {
			setError(err as Error);
			toast.error((err as Error).message || "Gagal memperbarui galeri.");
		}
	};

	const removeGaleri = async (id: number) => {
		try {
			await deleteGaleri(id);
			toast.success("Galeri berhasil dihapus.");
			await refreshGaleri();
		} catch (err) {
			setError(err as Error);
			toast.error((err as Error).message || "Gagal menghapus galeri.");
		}
	};

	return { galeri, loading, error, addGaleri, editGaleri, removeGaleri, refreshGaleri };
}
