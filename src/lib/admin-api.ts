import { api, handleApiError } from "@/lib/utils";
import { AdminData, CreateAdminData } from "./schema";

/**
 * Mengambil daftar semua admin.
 * @returns {Promise<AdminData[]>} List admin.
 * @throws {Error} Jika terjadi kegagalan saat mengambil data.
 * @note Ini mengambil semua anggota dan memfilternya di sisi klien,
 * yang tidak efisien. Sebaiknya, API menyediakan endpoint khusus
 * untuk mengambil admin, misalnya `/api/admins` atau `/api/anggota?role=admin`.
 */
export const getAdmins = async (): Promise<AdminData[]> => {
	try {
		const response = await api.get("/anggota/admins");
		return response.data;
	} catch (error) {
		handleApiError(error, "Gagal mengambil data admin");
	}
};

/**
 * Membuat admin baru.
 * @param {CreateAdminData} data - Data untuk admin baru.
 * @returns {Promise<AdminData>} Data admin yang baru dibuat.
 * @throws {Error} Jika terjadi kegagalan saat membuat admin.
 */
export const createAdmin = async (
	data: CreateAdminData
): Promise<AdminData> => {
	try {
		const response = await api.post("/auth/register", { ...data, role: "admin" });
		return response.data;
	} catch (error) {
		handleApiError(error, "Gagal membuat admin baru");
	}
};

/**
 * Memperbarui data admin yang ada.
 * @param {number} id - ID admin yang akan diperbarui.
 * @param {Partial<CreateAdminData>} data - Data yang akan diperbarui.
 * @returns {Promise<AdminData>} Data admin yang telah diperbarui.
 * @throws {Error} Jika terjadi kegagalan saat memperbarui admin.
 */
export const updateAdmin = async (
	id: number,
	data: Partial<CreateAdminData>
): Promise<AdminData> => {
	try {
		const response = await api.put(`/anggota/${id}`, data);
		return response.data;
	} catch (error) {
		handleApiError(error, `Gagal memperbarui admin dengan ID ${id}`);
	}
};

/**
 * Menghapus admin.
 * @param {number} id - ID admin yang akan dihapus.
 * @returns {Promise<void>}
 * @throws {Error} Jika terjadi kegagalan saat menghapus admin.
 */
export const deleteAdmin = async (id: number): Promise<void> => {
	try {
		await api.delete(`/anggota/${id}`);
	} catch (error) {
		handleApiError(error, `Gagal menghapus admin dengan ID ${id}`);
	}
};
