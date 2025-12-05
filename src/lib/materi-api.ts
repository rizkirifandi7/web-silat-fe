import { api } from "./utils";
import { Materi } from "@/lib/types";
import { toast } from "sonner";

export const getMateriByCourse = async (
	id_course: string
): Promise<Materi[]> => {
	try {
		const response = await api.get(`/course/materi/${id_course}`);
		// Backend returns paginated response: { data: [...], pagination: {...} }
		const data = response.data;
		return Array.isArray(data) ? data : (data?.data || []);
	} catch (error) {
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
		throw error;
	}
};

export const deleteMateri = async (id: number): Promise<void> => {
	try {
		const response = await api.delete(`/materi/${id}`);
		toast.success("Materi berhasil dihapus.");
		return response.data;
	} catch (error) {
		throw error;
	}
};
