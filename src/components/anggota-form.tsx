"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { anggotaFormSchema, Anggota } from "@/lib/schema";
import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg, resizeImage } from "@/lib/image-utils";
import { toast } from "sonner";

type AnggotaFormValues = z.infer<typeof anggotaFormSchema>;

interface AnggotaFormProps {
	onSubmit: (values: AnggotaFormValues, formData: FormData) => void;
	isPending: boolean;
	defaultValues?: Partial<Anggota>;
	isEdit?: boolean;
}

export function AnggotaForm({
	onSubmit,
	isPending,
	defaultValues,
	isEdit = false,
}: AnggotaFormProps) {
	const form = useForm<AnggotaFormValues>({
		resolver: zodResolver(
			anggotaFormSchema
				.refine(
					(data) => {
						if (!isEdit) {
							return data.password && data.password.length >= 6;
						}
						return true;
					},
					{
						message: "Password minimal harus 6 karakter.",
						path: ["password"],
					}
				)
				.refine(
					(data) => {
						if (!isEdit) {
							return data.password === data.confirmPassword;
						}
						return true;
					},
					{
						message: "Password dan konfirmasi password tidak cocok.",
						path: ["confirmPassword"],
					}
				)
		),
		defaultValues: {
			nama: defaultValues?.nama || "",
			email: defaultValues?.email || "",
			tempat_lahir: defaultValues?.tempat_lahir || "",
			tanggal_lahir: defaultValues?.tanggal_lahir
				? new Date(defaultValues.tanggal_lahir).toISOString().split("T")[0]
				: "",
			jenis_kelamin: defaultValues?.jenis_kelamin || "",
			alamat: defaultValues?.alamat || "",
			agama: defaultValues?.agama || "",
			no_telepon: defaultValues?.no_telepon || "",
			angkatan_unit: defaultValues?.angkatan_unit || "",
			status_keanggotaan: defaultValues?.status_keanggotaan || "",
			status_perguruan: defaultValues?.status_perguruan || "",
			tingkatan_sabuk: defaultValues?.tingkatan_sabuk || "",
			foto: defaultValues?.foto || null,
			password: "",
			confirmPassword: "",
		},
	});

	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [fotoPreview, setFotoPreview] = useState<string | null>(
		defaultValues?.foto || null
	);
	const [showCrop, setShowCrop] = useState(false);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageSrc(reader.result as string);
				setShowCrop(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCropApply = async () => {
		if (imageSrc && croppedAreaPixels) {
			try {
				const croppedImageBlob = await getCroppedImg(
					imageSrc,
					croppedAreaPixels
				);
				const resizedFile = await resizeImage(croppedImageBlob, 300, 300);
				const previewUrl = URL.createObjectURL(resizedFile);

				setFotoPreview(previewUrl);
				form.setValue("foto", resizedFile);
				setShowCrop(false);
			} catch (error) {
				toast.error("Gagal memotong gambar.");
				console.error(error);
			}
		}
	};

	const handleSubmit = (values: AnggotaFormValues) => {
		const formData = new FormData();
		const dataToSubmit: Partial<AnggotaFormValues> = { ...values };

		// Hapus confirmPassword karena tidak perlu dikirim ke backend
		delete dataToSubmit.confirmPassword;

		// Jika edit mode dan password kosong, hapus dari data submit
		if (
			isEdit &&
			(!dataToSubmit.password || dataToSubmit.password.trim() === "")
		) {
			delete dataToSubmit.password;
		}

		Object.entries(dataToSubmit).forEach(([key, value]) => {
			if (key === "foto" && value instanceof File) {
				formData.append(key, value);
			} else if (value !== null && value !== undefined && value !== "") {
				formData.append(key, String(value));
			}
		});

		if (!isEdit) {
			formData.append("role", "anggota");
		}

		onSubmit(values, formData);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex flex-col h-full"
			>
				<ScrollArea className="flex-grow p-4">
					<div className="space-y-4 pr-4">
						<FormField
							control={form.control}
							name="foto"
							render={() => (
								<FormItem>
									<FormLabel>Foto</FormLabel>
									<div className="flex flex-col items-center gap-4">
										{showCrop ? (
											<div className="relative w-full h-80 bg-gray-200 rounded-md">
												<Cropper
													image={imageSrc || ""}
													crop={crop}
													zoom={zoom}
													aspect={1}
													onCropChange={setCrop}
													onZoomChange={setZoom}
													onCropComplete={(_, area) =>
														setCroppedAreaPixels(area)
													}
												/>
												<div className="absolute bottom-2 left-2 right-2 flex gap-2">
													<Button
														type="button"
														onClick={handleCropApply}
														className="w-full"
													>
														Terapkan
													</Button>
													<Button
														type="button"
														variant="secondary"
														onClick={() => setShowCrop(false)}
														className="w-full"
													>
														Batal
													</Button>
												</div>
											</div>
										) : (
											<>
												<div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
													{fotoPreview ? (
														<Image
															src={fotoPreview}
															alt="Preview"
															width={128}
															height={128}
															className="object-cover w-full h-full"
														/>
													) : (
														<span className="text-xs text-muted-foreground">
															Foto
														</span>
													)}
												</div>
												<FormControl>
													<Button asChild variant="outline">
														<label htmlFor="foto-upload">
															<Upload className="w-4 h-4 mr-2" />
															Upload Foto
															<input
																id="foto-upload"
																type="file"
																accept="image/*"
																className="sr-only"
																onChange={handleFileChange}
															/>
														</label>
													</Button>
												</FormControl>
											</>
										)}
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
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder={isEdit ? "(Opsional)" : "********"}
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
												placeholder={isEdit ? "(Opsional)" : "********"}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
										<Input type="tel" placeholder="081234567890" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
												<SelectItem value="Belum punya">Belum punya</SelectItem>
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
												<SelectItem value="Sabuk Hijau">Sabuk Hijau</SelectItem>
												<SelectItem value="Sabuk Merah">Sabuk Merah</SelectItem>
												<SelectItem value="Sabuk Putih">Sabuk Putih</SelectItem>
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
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
												<SelectItem value="Guru Besar">Guru Besar</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</ScrollArea>
				<div className="p-4 border-t">
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? "Menyimpan..." : "Simpan"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
