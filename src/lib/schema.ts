import { z } from "zod";

export const anggotaSchema = z.object({
	id: z.number(),
	nama: z.string(),
	email: z.string().email(),
	role: z.string(),
	id_token: z.string(),
	tempat_lahir: z.string(),
	tanggal_lahir: z.string(),
	jenis_kelamin: z.string(),
	alamat: z.string(),
	agama: z.string(),
	no_telepon: z.string(),
	angkatan_unit: z.string(),
	status_keanggotaan: z.string(),
	status_perguruan: z.string(),
	tingkatan_sabuk: z.string(),
	foto: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});export type Anggota = z.infer<typeof anggotaSchema>;

export const loginSchema = z.object({
	email: z.string().email({ message: "Email tidak valid." }),
	password: z
		.string()
		.min(6, { message: "Password minimal harus 6 karakter." }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const galeriSchema = z.object({
	id: z.number(),
	gambar: z.string(),
	judul: z.string(),
	deskripsi: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Galeri = z.infer<typeof galeriSchema>;

export const adminSchema = z.object({
	nama: z.string().min(1, { message: "Nama tidak boleh kosong." }),
	email: z.string().email({ message: "Email tidak valid." }),
	password: z.string().min(6, { message: "Password minimal harus 6 karakter." }),
});

export type AdminData = z.infer<typeof adminSchema>;

