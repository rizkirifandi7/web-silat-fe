export type Seminar = {
	id: string;
	gambar: string;
	judul: string;
	deskripsi: string;
	tanggal_mulai: Date;
	tanggal_selesai: Date;
	waktu_mulai: string;
	waktu_selesai: string;
	lokasi: string;
	link_acara: string;
	harga: number;
	kuota: number;
	status: "Akan Datang" | "Berlangsung" | "Selesai";
	gambar_banner: string;
};
