import { api } from "./utils";
import { KategoriMateri } from "@/lib/schema";

export const getKategoriMateri = async (): Promise<KategoriMateri[]> => {
	try {
		const response = await api.get("/course");
		return response.data;
	} catch (error) {
		console.error("Error fetching kategori materi:", error);
		throw error;
	}
};

export const getKategoriMateriById = async (
	id: number
): Promise<KategoriMateri> => {
	try {
		const response = await api.get(`/course/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching kategori materi with id ${id}:`, error);
		throw error;
	}
};


export const createKategoriMateri = async (
	data: Partial<Omit<KategoriMateri, "id" | "createdAt" | "updatedAt">>
): Promise<KategoriMateri> => {
	try {
		const response = await api.post("/course", data);
		return response.data;
	} catch (error) {
		console.error("Error creating kategori materi:", error);
		throw error;
	}
};

export const updateKategoriMateri = async (
	id: number,
	data: Partial<Omit<KategoriMateri, "id" | "createdAt" | "updatedAt">>
): Promise<KategoriMateri> => {
	try {
		const response = await api.put(`/course/${id}`, data);
		return response.data;
	} catch (error) {
		console.error(`Error updating kategori materi with id ${id}:`, error);
		throw error;
	}
};

export const deleteKategoriMateri = async (id: number): Promise<void> => {
	try {
		const response = await api.delete(`/course/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error deleting kategori materi with id ${id}:`, error);
		throw error;
	}
};
