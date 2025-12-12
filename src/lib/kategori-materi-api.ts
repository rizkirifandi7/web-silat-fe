import { api } from "./utils";
import { KategoriMateri } from "@/lib/schema";

interface CourseResponse {
	status: string;
	message: string;
	data: KategoriMateri[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		total_pages: number;
	};
}

export const getKategoriMateri = async (): Promise<KategoriMateri[]> => {
	try {
		const response = await api.get<CourseResponse>("/course");
		// Extract data array from paginated response
		// Backend now includes materiCount in each course
		return response.data.data;
	} catch (error) {
		console.error("Error fetching kategori materi:", error);
		// Return empty array during build time or when API is unavailable
		return [];
	}
};

export const getKategoriMateriById = async (
	id: number
): Promise<KategoriMateri> => {
	try {
		const response = await api.get(`/course/${id}`);
		return response.data;
	} catch (error) {
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
		throw error;
	}
};

export const deleteKategoriMateri = async (id: number): Promise<void> => {
	try {
		const response = await api.delete(`/course/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const updateKategoriMateriOrder = async (
	orders: { id: number; urutan: number }[]
): Promise<void> => {
	try {
		const response = await api.put("/course/order", { orders });
		return response.data;
	} catch (error) {
		throw error;
	}
};
