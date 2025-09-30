import { Anggota } from "@/lib/schema";

export async function getAnggotaData(): Promise<Anggota[]> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota`, {
			cache: "no-store",
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		const data = await res.json();
		// Filter data to only include members with role "anggota"
		const filteredData = data.filter(
			(item: Anggota) => item.role === "anggota"
		);
		return filteredData;
	} catch (error) {
		console.error("Error fetching data:", error);
		return []; // Return an empty array on error
	}
}

export async function getAdminData(): Promise<Anggota[]> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota`, {
			cache: "no-store",
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		const data = await res.json();
		// Filter data to only include members with role "admin"
		const filteredData = data.filter((item: Anggota) => item.role === "admin");
		return filteredData;
	} catch (error) {
		console.error("Error fetching data:", error);
		return []; // Return an empty array on error
	}
}

export async function fetchAnggota(): Promise<Anggota[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota`);
	if (!response.ok) {
		throw new Error("Gagal mengambil data anggota");
	}
	const result = await response.json();
	const filterData = result.filter((item: Anggota) => item.role === "anggota");
	return filterData; // Langsung kembalikan array
}

export async function createAnggota(formData: FormData): Promise<Anggota> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
		{
			method: "POST",
			body: formData,
		}
	);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Gagal menambahkan anggota.");
	}
	const result = await response.json();
	return result.data;
}

export async function updateAnggota(
	id: number,
	formData: FormData
): Promise<Anggota> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/anggota/${id}`,
		{
			method: "PUT",
			body: formData,
		}
	);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Gagal memperbarui anggota.");
	}
	const result = await response.json();
	return result; // Langsung kembalikan objek data
}

export async function deleteAnggota(id: number): Promise<void> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/anggota/${id}`,
		{
			method: "DELETE",
		}
	);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Gagal menghapus anggota.");
	}
}

export async function fetchAdmin(): Promise<Anggota[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota`);
	if (!response.ok) {
		throw new Error("Gagal mengambil data admin");
	}
	const result = await response.json();
	const filterData = result.filter((item: Anggota) => item.role === "admin");
	return filterData;
}