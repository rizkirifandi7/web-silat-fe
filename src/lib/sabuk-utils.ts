/**
 * Utility functions untuk mengelola logika tingkatan sabuk dan hak akses materi
 */

// Urutan tingkatan sabuk dari TERENDAH ke TERTINGGI
// Index lebih besar = tingkatan lebih tinggi
// Index lebih kecil = tingkatan lebih rendah
export const URUTAN_SABUK = [
	"Belum punya",           // Index 0 - Terendah (tidak bisa akses apapun)
	"LULUS Binfistal",       // Index 1
	"Sabuk Putih",           // Index 2
	"Sabuk Kuning",          // Index 3
	"Sabuk Hijau",           // Index 4
	"Sabuk Merah",           // Index 5
	"Sabuk Hitam Wiraga 1",  // Index 6
	"Sabuk Hitam Wiraga 2",  // Index 7
	"Sabuk Hitam Wiraga 3",  // Index 8 - Tertinggi
] as const;

export type TingkatanSabuk = (typeof URUTAN_SABUK)[number];
export type TingkatanSabukValid = (typeof URUTAN_SABUK)[number];

/**
 * Mengecek apakah anggota dengan tingkatan tertentu bisa mengakses materi
 * 
 * LOGIC: Anggota dengan sabuk tinggi dapat mengakses materi dengan sabuk sama atau lebih rendah.
 *        Anggota TIDAK dapat mengakses materi dengan sabuk lebih tinggi dari sabuknya.
 * 
 * @param tingkatanAnggota - Tingkatan sabuk anggota
 * @param tingkatanMateri - Tingkatan sabuk yang diperlukan untuk materi
 * @returns true jika anggota bisa mengakses materi, false jika tidak
 *
 * @example
 * bisaAksesMateri("Sabuk Hitam Wiraga 3", "Sabuk Putih") // true - Hitam bisa akses Putih
 * bisaAksesMateri("Sabuk Merah", "Sabuk Kuning") // true - Merah bisa akses Kuning (lebih rendah)
 * bisaAksesMateri("Sabuk Merah", "Sabuk Hitam Wiraga 1") // false - Merah tidak bisa akses Hitam
 * bisaAksesMateri("Sabuk Kuning", "Sabuk Kuning") // true - Sama, bisa akses
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

	// Jika materi tidak memerlukan tingkatan atau "Belum punya", semua anggota bisa akses
	if (
		!tingkatanMateri ||
		tingkatanMateri === "Belum punya" ||
		tingkatanMateri.trim() === ""
	) {
		return true;
	}

	const idxAnggota = URUTAN_SABUK.indexOf(tingkatanAnggota as TingkatanSabukValid);
	const idxMateri = URUTAN_SABUK.indexOf(tingkatanMateri as TingkatanSabukValid);

	// Jika tingkatan tidak ditemukan dalam daftar, tidak bisa akses
	if (idxAnggota === -1 || idxMateri === -1) {
		return false;
	}

	// Anggota dengan tingkatan lebih tinggi (index lebih besar) bisa akses materi tingkatan lebih rendah (index lebih kecil atau sama)
	// Contoh: Sabuk Merah (idx 5) bisa akses materi idx <= 5 (Merah, Hijau, Kuning, Putih, Binfistal)
	//         Sabuk Merah (idx 5) TIDAK bisa akses materi idx > 5 (Hitam Wiraga 1, 2, 3)
	return idxAnggota >= idxMateri;
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
