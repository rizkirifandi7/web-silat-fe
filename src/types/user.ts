export interface User {
	id: string | number;
	nama: string;
	email?: string;
	role: "admin" | "anggota" | "superadmin";
	id_token?: string;
	tempat_lahir?: string;
	tanggal_lahir?: string;
	jenis_kelamin?: string;
	alamat?: string;
	agama?: string;
	no_telepon?: string;
	angkatan_unit?: string;
	status_keanggotaan?: string;
	status_perguruan?: string;
	tingkatan_sabuk?: string;
	foto?: string;
	createdAt?: string;
	updatedAt?: string;
}
