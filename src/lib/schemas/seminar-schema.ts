import { z } from "zod";

export const seminarSchema = z.object({
  nama: z.string().min(3, { message: "Nama seminar harus lebih dari 3 karakter" }),
  tanggal: z.coerce.date({
    required_error: "Tanggal seminar harus diisi.",
    invalid_type_error: "Format tanggal tidak valid.",
  }),
  lokasi: z.string().min(3, { message: "Lokasi seminar harus lebih dari 3 karakter" }),
  deskripsi: z.string().min(10, { message: "Deskripsi harus lebih dari 10 karakter" }),
});

export type SeminarSchema = z.infer<typeof seminarSchema>;

