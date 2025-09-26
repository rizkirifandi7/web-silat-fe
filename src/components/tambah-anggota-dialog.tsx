import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import Image from "next/image";
import { Anggota, anggotaSchema } from "@/lib/schema";
import { toast } from "sonner";

// Skema ini hanya untuk validasi form, tidak termasuk id_token
const FormSchema = z
	.object({
		nama: z.string().nonempty("Nama lengkap harus diisi."),
		email: z.string().email("Email tidak valid."),
		password: z
			.string()
			.min(6, "Password minimal harus 6 karakter.")
			.nonempty("Password harus diisi."),
		confirmPassword: z.string().nonempty("Konfirmasi password harus diisi."),
		tempat_lahir: z.string().nonempty("Tempat lahir harus diisi."),
		tanggal_lahir: z.string().nonempty("Tanggal lahir harus diisi."),
		jenis_kelamin: z.string().nonempty("Jenis kelamin harus diisi."),
		alamat: z.string().nonempty("Alamat harus diisi."),
		agama: z.string().nonempty("Agama harus diisi."),
		no_telepon: z.string().nonempty("No. telepon harus diisi."),
		angkatan_unit: z.string().nonempty("Angkatan unit harus diisi."),
		status_keanggotaan: z.string().nonempty("Status keanggotaan harus diisi."),
		status_perguruan: z.string().nonempty("Status di perguruan harus diisi."),
		tingkatan_sabuk: z.string().nonempty("Tingkatan sabuk harus diisi."),
		foto: z.any(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password dan konfirmasi password tidak cocok.",
		path: ["confirmPassword"],
	});

export function TambahAnggotaDialog({
	isOpen,
	onOpenChange,
	onAnggotaAdded,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onAnggotaAdded: (data: Anggota) => void;
}) {
	const [fotoPreview, setFotoPreview] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			nama: "",
			email: "",
			password: "",
			confirmPassword: "",
			tempat_lahir: "",
			tanggal_lahir: "",
			jenis_kelamin: "Laki-laki",
			alamat: "",
			agama: "Islam",
			no_telepon: "",
			angkatan_unit: new Date().getFullYear().toString(),
			status_keanggotaan: "Aktif",
			status_perguruan: "Anggota",
			tingkatan_sabuk: "Belum punya",
			foto: null,
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		setIsSubmitting(true);
		const formData = new FormData();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword, ...restValues } = values;
		Object.entries(restValues).forEach(([key, value]) => {
			if (key === "foto") {
				if (value instanceof File) {
					formData.append(key, value);
				}
			} else if (value) {
				formData.append(key, value as string);
			}
		});

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
				{
					method: "POST",
					body: formData,
					// Headers are not needed for FormData with fetch, browser sets it
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal menambahkan anggota.");
			}

			const result = await response.json();

			// Buat objek anggota baru dari form values dan response
			const newAnggotaData = {
				id: result.user.id, // Asumsi ID anggota akan sama dengan ID user
				id_user: result.user.id,
				user: {
					nama: values.nama,
					email: values.email,
				},
				...restValues,
				foto: fotoPreview || "", // Gunakan preview jika ada
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			// Validasi dengan skema Anggota sebelum memanggil onAnggotaAdded
			const parsedAnggota = anggotaSchema.parse(newAnggotaData);

			onAnggotaAdded(parsedAnggota);
			form.reset();
			setFotoPreview(null);
			toast.success("Anggota berhasil ditambahkan!");
			onOpenChange(false); // Tutup dialog setelah berhasil
		} catch (error) {
			console.error("Error submitting form:", error);
			if (error instanceof z.ZodError) {
				toast.error(
					`Kesalahan validasi data: ${error.issues
						.map((e) => e.message)
						.join(", ")}`
				);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Terjadi kesalahan yang tidak diketahui.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Tambah Anggota Baru</DialogTitle>
					<DialogDescription>
						Isi formulir di bawah ini untuk menambahkan anggota baru ke dalam
						sistem.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<ScrollArea className="h-96 w-full p-4">
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="foto"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Foto</FormLabel>
											<div className="flex items-center gap-4">
												{fotoPreview ? (
													<Image
														src={fotoPreview}
														alt="Preview Foto"
														width={80}
														height={80}
														className="rounded-md object-cover"
													/>
												) : (
													<div className="h-20 w-20 rounded-md bg-secondary"></div>
												)}
												<FormControl>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) => {
															const file = e.target.files?.[0];
															if (file) {
																const reader = new FileReader();
																reader.onloadend = () => {
																	setFotoPreview(reader.result as string);
																	field.onChange(file);
																};
																reader.readAsDataURL(file);
															}
														}}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="nama"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nama Lengkap</FormLabel>
											<FormControl>
												<Input placeholder="Contoh: Budi Santoso" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="contoh@email.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="******"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Konfirmasi Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="******"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="tempat_lahir"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tempat Lahir</FormLabel>
												<FormControl>
													<Input placeholder="Contoh: Jakarta" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="tanggal_lahir"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tanggal Lahir</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="alamat"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Alamat</FormLabel>
											<FormControl>
												<Input placeholder="Jl. Merpati No. 10" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="jenis_kelamin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Jenis Kelamin</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Pilih jenis kelamin" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Laki-laki">Laki-laki</SelectItem>
														<SelectItem value="Perempuan">Perempuan</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="agama"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Agama</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Pilih agama" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Islam">Islam</SelectItem>
														<SelectItem value="Kristen">Kristen</SelectItem>
														<SelectItem value="Katolik">Katolik</SelectItem>
														<SelectItem value="Hindu">Hindu</SelectItem>
														<SelectItem value="Buddha">Buddha</SelectItem>
														<SelectItem value="Konghucu">Konghucu</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="no_telepon"
									render={({ field }) => (
										<FormItem>
											<FormLabel>No. Telepon</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="081234567890"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="angkatan_unit"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Angkatan Unit</FormLabel>
												<FormControl>
													<Input type="number" placeholder="2021" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="tingkatan_sabuk"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tingkatan Sabuk</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Pilih tingkatan sabuk" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Belum punya">
															Belum punya
														</SelectItem>
														<SelectItem value="LULUS Binfistal">
															LULUS Binfistal
														</SelectItem>
														<SelectItem value="Sabuk Hitam Wiraga 1">
															Sabuk Hitam Wiraga 1
														</SelectItem>
														<SelectItem value="Sabuk Hitam Wiraga 2">
															Sabuk Hitam Wiraga 2
														</SelectItem>
														<SelectItem value="Sabuk Hitam Wiraga 3">
															Sabuk Hitam Wiraga 3
														</SelectItem>
														<SelectItem value="Sabuk Hijau">
															Sabuk Hijau
														</SelectItem>
														<SelectItem value="Sabuk Merah">
															Sabuk Merah
														</SelectItem>
														<SelectItem value="Sabuk Putih">
															Sabuk Putih
														</SelectItem>
														<SelectItem value="Sabuk Kuning">
															Sabuk Kuning
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="status_keanggotaan"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status Keanggotaan</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Pilih status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Aktif">Aktif</SelectItem>
														<SelectItem value="Pasif">Pasif</SelectItem>
														<SelectItem value="Non Aktif">Non Aktif</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="status_perguruan"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status di Perguruan</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Pilih status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Pelatih">Pelatih</SelectItem>
														<SelectItem value="Anggota">Anggota</SelectItem>
														<SelectItem value="Alumni">Alumni</SelectItem>
														<SelectItem value="Guru Besar">
															Guru Besar
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</ScrollArea>
						<DialogFooter className="pt-4">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Menyimpan..." : "Simpan"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
