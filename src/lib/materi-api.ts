import { api } from "./utils";
import { Materi } from "@/lib/types";
import { toast } from "sonner";

export const getMateriByCourse = async (
	id_course: string
): Promise<Materi[]> => {
	try {
		const response = await api.get<Materi[]>(`/course/materi/${id_course}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching materi by course:", error);
		throw error;
	}
};

export const createMateri = async (data: FormData): Promise<Materi> => {
	try {
		const response = await api.post("/materi", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		toast.success("Materi berhasil dibuat.");
		return response.data;
	} catch (error) {
		console.error("Error creating materi:", error);
		throw error;
	}
};

export const updateMateri = async (
	id: number,
	data: FormData
): Promise<Materi> => {
	try {
		const response = await api.put(`/materi/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		toast.success("Materi berhasil diperbarui.");
		return response.data;
	} catch (error) {
		console.error(`Error updating materi with id ${id}:`, error);
		throw error;
	}
};

export const deleteMateri = async (id: number): Promise<void> => {
	try {
		const response = await api.delete(`/materi/${id}`);
		toast.success("Materi berhasil dihapus.");
		return response.data;
	} catch (error) {
		console.error(`Error deleting materi with id ${id}:`, error);
		throw error;
	}
};
