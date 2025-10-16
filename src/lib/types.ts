export interface User {
	id: number;
	nama: string;
	email: string;
	foto: string;
	role: string;
	id_token: string;
	createdAt: string;
	updatedAt: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	alamat: string;
	agama: string;
	jenis_kelamin: string;
	no_telepon: string;
	angkatan_unit: string;
	status_keanggotaan: string;
	tingkatan_sabuk: string;
	status_perguruan: string;
}

export interface Seminar {
  id: string;
  nama: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  narasumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Materi {
	id: number;
	id_course: number;
	judul: string;
	deskripsi: string;
	tipeKonten: "pdf" | "video";
	konten: string | null;
	tingkatan:
		| "Belum punya"
		| "LULUS Binfistal"
		| "Sabuk Putih"
		| "Sabuk Kuning"
		| "Sabuk Hijau"
		| "Sabuk Merah"
		| "Sabuk Hitam Wiraga 1"
		| "Sabuk Hitam Wiraga 2"
		| "Sabuk Hitam Wiraga 3";
	createdAt: string;
	updatedAt: string;
}

export interface Course {
	id: number;
	judul: string;
	deskripsi: string;
	createdAt: string;
	updatedAt: string;
	Materis: Materi[];
}
