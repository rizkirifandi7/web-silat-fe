import { KategoriMateri } from "@/lib/schema";

export const getKategoriMateri = async (): Promise<KategoriMateri[]> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/course`,
			{
				cache: "no-store",
			}
		);
		if (!response.ok) {
			throw new Error("Gagal mengambil data kategori materi");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching kategori materi:", error);
		throw error;
	}
};

export const getKategoriMateriById = async (
	id: number
): Promise<KategoriMateri> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/course/${id}`,
			{
				cache: "no-store",
			}
		);
		if (!response.ok) {
			throw new Error("Gagal mengambil data kategori materi");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Error fetching kategori materi with id ${id}:`, error);
		throw error;
	}
};

export const createKategoriMateri = async (
	data: Omit<KategoriMateri, "id" | "createdAt" | "updatedAt">
): Promise<KategoriMateri> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/course`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal menambahkan kategori materi.");
		}
		const result = await response.json();
		return result.data;
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
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/course/${id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal memperbarui kategori materi.");
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(`Error updating kategori materi with id ${id}:`, error);
		throw error;
	}
};

export const deleteKategoriMateri = async (id: number): Promise<void> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/course/${id}`,
			{
				method: "DELETE",
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal menghapus kategori materi.");
		}
	} catch (error) {
		console.error(`Error deleting kategori materi with id ${id}:`, error);
		throw error;
	}
};
