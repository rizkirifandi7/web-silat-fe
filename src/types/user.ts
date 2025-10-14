export interface User {
	id: string;
	nama: string;
	role: "admin" | "anggota" | "superadmin";
	foto?: string;
}
