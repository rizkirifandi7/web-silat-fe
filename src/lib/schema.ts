import { z } from "zod";

export const anggotaSchema = z.object({
	id: z.coerce.string(),
	id_user: z.number(),
	id_token: z.string().optional(),
	user: z.object({
		nama: z.string(),
		email: z.string().email(),
		role: z.string(),
	}),
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
	foto: z.string().url().or(z.literal("")),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});export type Anggota = z.infer<typeof anggotaSchema>;

export const loginSchema = z.object({
	email: z.string().email({ message: "Email tidak valid." }),
	password: z
		.string()
		.min(6, { message: "Password minimal harus 6 karakter." }),
});

export type LoginData = z.infer<typeof loginSchema>;
