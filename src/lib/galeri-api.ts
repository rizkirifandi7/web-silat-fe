import { Galeri } from "@/lib/schema";

export const getGaleri = async (): Promise<Galeri[]> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/galeri`, {
			cache: "no-store",
		});
		if (!response.ok) {
			throw new Error("Gagal mengambil data galeri");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching galeri:", error);
		throw error;
	}
};

export const createGaleri = async (formData: FormData): Promise<Galeri> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/galeri`, {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal menambahkan galeri.");
		}
		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error("Error creating galeri:", error);
		throw error;
	}
};

export const updateGaleri = async (
	id: number,
	formData: FormData
): Promise<Galeri> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/galeri/${id}`,
			{
				method: "PUT",
				body: formData,
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal memperbarui galeri.");
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(`Error updating galeri with id ${id}:`, error);
		throw error;
	}
};

export const deleteGaleri = async (id: number): Promise<void> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/galeri/${id}`,
			{
				method: "DELETE",
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Gagal menghapus galeri.");
		}
	} catch (error) {
		console.error(`Error deleting galeri with id ${id}:`, error);
		throw error;
	}
};
