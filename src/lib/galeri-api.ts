import { api } from "./utils";
import { Galeri } from "@/lib/schema";

export const getGaleri = async (): Promise<Galeri[]> => {
	try {
		const response = await api.get("/galeri");
		return response.data;
	} catch (error) {
		console.error("Error fetching galeri:", error);
		throw error;
	}
};

export const createGaleri = async (formData: FormData): Promise<Galeri> => {
	try {
		const response = await api.post("/galeri", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching galeri:", error);
		throw error;
	}
};


export const updateGaleri = async (
	id: number,
	formData: FormData
): Promise<Galeri> => {
	try {
		const response = await api.put(`/galeri/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error(`Error updating galeri with id ${id}:`, error);
		throw error;
	}
};

export const deleteGaleri = async (id: number): Promise<void> => {
	try {
		await api.delete(`/galeri/${id}`);
	} catch (error) {
		console.error(`Error deleting galeri with id ${id}:`, error);
		throw error;
	}
};
