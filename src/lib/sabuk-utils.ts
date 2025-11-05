/**
 * Utility functions untuk mengelola logika tingkatan sabuk dan hak akses materi
 */

// Urutan tingkatan sabuk dari TERTINGGI ke TERENDAH
// Index lebih kecil = tingkatan lebih tinggi
export const URUTAN_SABUK = [
	"Sabuk Kuning", // Index 0 - Tertinggi
	"Sabuk Putih", // Index 1
	"Sabuk Merah", // Index 2
	"Sabuk Hijau", // Index 3
	"Sabuk Hitam Wiraga 3", // Index 4
	"Sabuk Hitam Wiraga 2", // Index 5
	"Sabuk Hitam Wiraga 1", // Index 6 - Terendah
] as const;

export type TingkatanSabuk = (typeof URUTAN_SABUK)[number] | "Belum punya";
export type TingkatanSabukValid = (typeof URUTAN_SABUK)[number];

/**
 * Mengecek apakah anggota dengan tingkatan tertentu bisa mengakses materi
 * @param tingkatanAnggota - Tingkatan sabuk anggota
 * @param tingkatanMateri - Tingkatan sabuk yang diperlukan untuk materi
 * @returns true jika anggota bisa mengakses materi, false jika tidak
 *
 * @example
 * bisaAksesMateri("Sabuk Kuning", "Sabuk Hitam Wiraga 1") // true - Kuning bisa akses semua
 * bisaAksesMateri("Sabuk Merah", "Sabuk Kuning") // false - Merah tidak bisa akses Kuning
 * bisaAksesMateri("Sabuk Merah", "Sabuk Hijau") // true - Merah bisa akses Hijau
 * bisaAksesMateri("Belum punya", "Sabuk Putih") // false - Belum punya tidak bisa akses apapun
 */
export function bisaAksesMateri(
	tingkatanAnggota: string,
	tingkatanMateri: string
): boolean {
	// Jika anggota belum punya sabuk, tidak bisa akses materi apapun
	if (
		!tingkatanAnggota ||
		tingkatanAnggota === "Belum punya" ||
		tingkatanAnggota.trim() === ""
	) {
		return false;
	}

	const idxAnggota = URUTAN_SABUK.indexOf(
		tingkatanAnggota as TingkatanSabukValid
	);
	const idxMateri = URUTAN_SABUK.indexOf(
		tingkatanMateri as TingkatanSabukValid
	);

	// Jika tingkatan tidak ditemukan dalam daftar, tidak bisa akses
	if (idxAnggota === -1 || idxMateri === -1) {
		return false;
	}

	// Anggota dengan tingkatan lebih tinggi (indeks lebih kecil) bisa akses materi tingkatan lebih rendah
	// Contoh: Sabuk Kuning (idx 0) bisa akses semua materi (idx 0-6)
	//         Sabuk Merah (idx 2) bisa akses materi idx 2-6 (Merah, Hijau, Hitam)
	return idxAnggota <= idxMateri;
}

/**
 * Mendapatkan tingkatan sabuk dengan fallback
 * @param tingkatan - Tingkatan sabuk atau undefined/null
 * @returns Tingkatan sabuk atau "Belum punya"
 */
export function getTingkatanSabuk(
	tingkatan: string | undefined | null
): string {
	return tingkatan && tingkatan.trim() !== "" ? tingkatan : "Belum punya";
}
