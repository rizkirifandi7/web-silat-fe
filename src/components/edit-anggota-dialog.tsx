"use client";

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
import { useState, useEffect } from "react";
import Image from "next/image";
import { Anggota } from "@/lib/schema";

// Skema form sama dengan tambah, tapi kita akan mengisi defaultValues dari props
const FormSchema = z.object({
	nama_lengkap: z.string().nonempty("Nama lengkap harus diisi."),
	nama_panggilan: z.string().nonempty("Nama panggilan harus diisi."),
	email: z.string().email("Email tidak valid."),
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
});

export function EditAnggotaDialog({
	anggota,
	isOpen,
	onOpenChange,
	onAnggotaUpdated,
}: {
	anggota: Anggota | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onAnggotaUpdated: (data: Anggota) => void;
}) {
	const [fotoPreview, setFotoPreview] = useState<string | null>(null);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	useEffect(() => {
		if (anggota) {
			form.reset(anggota);
			setFotoPreview(anggota.foto);
		}
	}, [anggota, form]);

	const statusPerguruan = form.watch("status_perguruan");

	function onSubmit(values: z.infer<typeof FormSchema>) {
		if (!anggota) return;

		const dataToSubmit = {
			...anggota,
			...values,
			foto:
				fotoPreview ||
				`https://via.placeholder.com/150?text=${values.nama_panggilan}`,
		};
		onAnggotaUpdated(dataToSubmit);
		onOpenChange(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit Data Anggota</DialogTitle>
					<DialogDescription>
						Perbarui informasi anggota di bawah ini. Klik simpan untuk
						menerapkan perubahan.
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
									name="nama_lengkap"
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
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="nama_panggilan"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nama Panggilan</FormLabel>
												<FormControl>
													<Input placeholder="Contoh: Budi" {...field} />
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
														<SelectItem value="Yang lain">Yang lain</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									{statusPerguruan === "Yang lain" && (
										<FormField
											control={form.control}
											name="status_perguruan"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Sebutkan Status Lainnya</FormLabel>
													<FormControl>
														<Input
															placeholder="Status lainnya"
															{...field}
															onChange={(e) => field.onChange(e.target.value)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</div>
							</div>
						</ScrollArea>
						<DialogFooter className="pt-4">
							<Button type="submit">Simpan Perubahan</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
