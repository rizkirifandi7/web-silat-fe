import { api, handleApiError } from "@/lib/utils";
import { Anggota } from "./schema";

/**
 * Mengambil daftar semua anggota.
 * @returns {Promise<Anggota[]>} List anggota.
 * @throws {Error} Jika terjadi kegagalan saat mengambil data.
 */
export const getAnggotas = async (): Promise<Anggota[]> => {
	try {
		const response = await api.get("/anggota");
		return response.data;
	} catch (error) {
		handleApiError(error, "Gagal mengambil data anggota");
	}
};

/**
 * Membuat anggota baru.
 * @param {FormData} formData - Data untuk anggota baru, termasuk file foto.
 * @returns {Promise<Anggota>} Data anggota yang baru dibuat.
 * @throws {Error} Jika terjadi kegagalan saat membuat anggota.
 */
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

/**
 * Memperbarui data anggota yang ada.
 * @param {number} id - ID anggota yang akan diperbarui.
 * @param {FormData} formData - Data yang akan diperbarui.
 * @returns {Promise<Anggota>} Data anggota yang telah diperbarui.
 * @throws {Error} Jika terjadi kegagalan saat memperbarui anggota.
 */
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

/**
 * Menghapus anggota.
 * @param {number} id - ID anggota yang akan dihapus.
 * @returns {Promise<void>}
 * @throws {Error} Jika terjadi kegagalan saat menghapus anggota.
 */
export const deleteAnggota = async (id: number): Promise<void> => {
	try {
		await api.delete(`/anggota/${id}`);
	} catch (error) {
		handleApiError(error, `Gagal menghapus anggota dengan ID ${id}`);
	}
};