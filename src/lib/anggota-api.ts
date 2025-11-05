import { api, handleApiError } from "@/lib/utils";
import { Anggota } from "./schema";

export const getAnggotas = async (): Promise<Anggota[]> => {
	try {
		const response = await api.get("/anggota");
		return response.data;
	} catch (error) {
		console.error("Error fetching anggota:", error);
		// Return empty array during build time or when API is unavailable
		return [];
	}
};

export const createAnggota = async (formData: FormData): Promise<Anggota> => {
	try {
		const response = await api.post("/auth/register", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		handleApiError(error, "Gagal membuat anggota baru");
	}
};

export const updateAnggota = async (
	id: number,
	formData: FormData
): Promise<Anggota> => {
	try {
		const response = await api.put(`/anggota/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		handleApiError(error, `Gagal memperbarui anggota dengan ID ${id}`);
	}
};

export const deleteAnggota = async (id: number): Promise<void> => {
	try {
		await api.delete(`/anggota/${id}`);
	} catch (error) {
		handleApiError(error, `Gagal menghapus anggota dengan ID ${id}`);
	}
};