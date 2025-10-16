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
	id: z.number().optional(),
	nama: z.string().min(1, { message: "Nama tidak boleh kosong." }),
	email: z.string().email({ message: "Email tidak valid." }),
	password: z.string().optional(),
	role: z.enum(["admin", "superadmin"]),
	no_telepon: z.string().min(1, { message: "No telepon tidak boleh kosong." }),
});

export const createAdminSchema = adminSchema.extend({
	password: z.string().min(6, { message: "Password minimal harus 6 karakter." }),
});

export const editAdminSchema = adminSchema.extend({
	password: z
		.string()
		.min(6, { message: "Password harus minimal 6 karakter jika diisi." })
		.optional()
		.or(z.literal("")),
});

export type AdminData = z.infer<typeof adminSchema>;

export type CreateAdminData = z.infer<typeof createAdminSchema>;

export const materiSchema = z.object({
	id: z.number(),
	judul: z.string(),
	tipeKonten: z.enum(["video", "pdf"]),
	konten: z.string(),
	id_course: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const materiFormSchema = materiSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		konten: z.any(),
	});

export type Materi = z.infer<typeof materiSchema>;

export const kategoriMateriSchema = z.object({
	id: z.number(),
	judul: z.string(),
	deskripsi: z.string(),
	materi: z.array(materiSchema).optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type KategoriMateri = z.infer<typeof kategoriMateriSchema>;

// Skema dasar untuk data yang dapat diedit pada form anggota
export const anggotaFormSchema = z.object({
	nama: z.string().min(1, "Nama lengkap harus diisi."),
	email: z.string().email("Email tidak valid."),
	tempat_lahir: z.string().min(1, "Tempat lahir harus diisi."),
	tanggal_lahir: z.string().min(1, "Tanggal lahir harus diisi."),
	jenis_kelamin: z.string().min(1, "Jenis kelamin harus diisi."),
	alamat: z.string().min(1, "Alamat harus diisi."),
	agama: z.string().min(1, "Agama harus diisi."),
	no_telepon: z.string().min(1, "No. telepon harus diisi."),
	angkatan_unit: z.string().min(1, "Angkatan unit harus diisi."),
	status_keanggotaan: z.string().min(1, "Status keanggotaan harus diisi."),
	status_perguruan: z.string().min(1, "Status perguruan harus diisi."),
	tingkatan_sabuk: z.string().min(1, "Tingkatan sabuk harus diisi."),
	foto: z.any().optional(),
	password: z.string().optional(),
	confirmPassword: z.string().optional(),
});

// Skema untuk membuat anggota baru, password wajib diisi
export const createAnggotaSchema = anggotaFormSchema
	.extend({
		password: z.string().min(6, "Password minimal harus 6 karakter."),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password dan konfirmasi password tidak cocok.",
		path: ["confirmPassword"],
	});

// Skema untuk mengedit anggota, password opsional
export const editAnggotaSchema = anggotaFormSchema;

// Tipe data yang diinfer dari skema
export type CreateAnggotaData = z.infer<typeof createAnggotaSchema>;
export type EditAnggotaData = z.infer<typeof editAnggotaSchema>;


export const seminarSchema = z.object({
	id: z.number(),
	gambar: z.string(),
	judul: z.string(),
	deskripsi: z.string(),
	tanggal_mulai: z.string(),
	tanggal_selesai: z.string(),
	waktu_mulai: z.string(),
	waktu_selesai: z.string(),
	lokasi: z.string(),
	link_acara: z.string().optional(),
	harga: z.number(),
	kuota: z.number(),
	status: z.enum(["Akan Datang", "Berlangsung", "Selesai"]),
	gambar_banner: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const seminarFormSchema = z.object({
	judul: z.string().min(1, "Judul tidak boleh kosong."),
	deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong."),
	tanggal_mulai: z.string().min(1, "Tanggal mulai tidak boleh kosong."),
	tanggal_selesai: z.string().min(1, "Tanggal selesai tidak boleh kosong."),
	waktu_mulai: z.string().min(1, "Waktu mulai tidak boleh kosong."),
	waktu_selesai: z.string().min(1, "Waktu selesai tidak boleh kosong."),
	lokasi: z.string().min(1, "Lokasi tidak boleh kosong."),
	link_acara: z.string().url({ message: "Link acara tidak valid." }).optional().or(z.literal("")),
	harga: z.number().min(0, "Harga tidak boleh kurang dari 0"),
	kuota: z.number().min(0, "Kuota tidak boleh kurang dari 0"),
	status: z.enum(["Akan Datang", "Berlangsung", "Selesai"]),
	gambar: z.any().optional(),
	gambar_banner: z.any().optional(),
});

export type SeminarFormData = z.infer<typeof seminarFormSchema>;

export type Seminar = z.infer<typeof seminarSchema>;