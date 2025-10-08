import { Materi } from "@/lib/schema";
import { toast } from "sonner";

export const getMateriByCourse = async (id_course: string): Promise<Materi[]> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/course/${id_course}`,
			{
				cache: "no-store",
			}
		);
		if (!response.ok) {
			throw new Error("Gagal mengambil data materi");
		}
		const data = await response.json();
		// Assuming the API returns a course object with a 'Materis' array
		return data.Materis || [];
	} catch (error) {
		console.error("Error fetching materi:", error);
		throw error;
	}
};

export const createMateri = async (data: FormData): Promise<Materi> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/materi`,
			{
				method: "POST",
				body: data,
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal menambahkan materi.");
		}
		const result = await response.json();
		toast.success("Materi berhasil ditambahkan.");
		return result.data;
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
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/materi/${id}`,
			{
				method: "PUT",
				body: data,
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal memperbarui materi.");
		}
		const result = await response.json();
		toast.success("Materi berhasil diperbarui.");
		return result.data;
	} catch (error) {
		console.error(`Error updating materi with id ${id}:`, error);
		throw error;
	}
};

export const deleteMateri = async (id: number): Promise<void> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/materi/${id}`,
			{
				method: "DELETE",
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal menghapus materi.");
		}
		toast.success("Materi berhasil dihapus.");
	} catch (error) {
		console.error(`Error deleting materi with id ${id}:`, error);
		throw error;
	}
};
