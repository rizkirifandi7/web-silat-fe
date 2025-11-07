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

/**
 * Get anggota data by verification token
 * This function can be used both on client and server side
 * @param token - The verification token from QR code
 * @param options - Optional fetch configuration
 * @returns Anggota data or null if not found
 */
export const getAnggotaByToken = async (
	token: string,
	options?: {
		cache?: RequestCache;
		revalidate?: number | false;
	}
): Promise<Anggota | null> => {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		if (!apiUrl) {
			throw new Error("API URL is not configured");
		}

		const response = await fetch(`${apiUrl}/anggota/token/${token}`, {
			cache: options?.cache || "no-store",
			next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined,
		});

		if (!response.ok) {
			if (response.status === 404) {
				console.log(`Anggota with token ${token} not found`);
				return null;
			}
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Failed to fetch anggota: ${response.statusText}`
			);
		}

		const data: Anggota = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching anggota by token:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Failed to fetch anggota data");
	}
};