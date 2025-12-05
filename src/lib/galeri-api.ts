import { api } from "./utils";
import { Galeri } from "@/lib/schema";

export const getGaleri = async (): Promise<Galeri[]> => {
	try {
		const response = await api.get("/galeri");
		// Backend returns { data: [...], pagination: {...} }
		return Array.isArray(response.data) ? response.data : response.data.data || [];
	} catch (error) {
		return [];
	}
};

export const createGaleri = async (data: {
	judul: string;
	deskripsi: string;
	gambar_url?: string;
}): Promise<Galeri> => {
	try {
		const response = await api.post("/galeri", {
			judul: data.judul,
			deskripsi: data.deskripsi,
			gambar: data.gambar_url,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const updateGaleri = async (
	id: number,
	data: {
		judul: string;
		deskripsi: string;
		gambar_url?: string;
	}
): Promise<Galeri> => {
	try {
		const response = await api.put(`/galeri/${id}`, {
			judul: data.judul,
			deskripsi: data.deskripsi,
			gambar: data.gambar_url,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const deleteGaleri = async (id: number): Promise<void> => {
	try {
		await api.delete(`/galeri/${id}`);
	} catch (error) {
		throw error;
	}
};

/**
 * Upload galeri image separately (like donation campaign)
 * Returns the cloudinary URL
 */
export const uploadGaleriImage = async (file: File): Promise<string> => {
	try {
		const formData = new FormData();
		formData.append("gambar", file);

		const response = await api.post("/galeri/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		
		return response.data.data.gambar_url;
	} catch (error) {
		throw error;
	}
};
