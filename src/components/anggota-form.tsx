"use client";

import { useFormContext } from "react-hook-form";
import {
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
import { Edit } from "lucide-react";
import Cropper from "react-easy-crop";

interface AnggotaFormProps {
	isEditMode?: boolean;
	fotoPreview: string | null;
	showCrop: boolean;
	imageSrc: string | null;
	crop: { x: number; y: number };
	zoom: number;
	onCropChange: (crop: { x: number; y: number }) => void;
	onZoomChange: (zoom: number) => void;
	onCropComplete: (
		croppedArea: { width: number; height: number; x: number; y: number },
		croppedAreaPixels: { width: number; height: number; x: number; y: number }
	) => void;
	handleCropApply: () => void;
	setShowCrop: (show: boolean) => void;
	setImageSrc: (src: string | null) => void;
}

export function AnggotaForm({
	isEditMode = false,
	fotoPreview,
	showCrop,
	imageSrc,
	crop,
	zoom,
	onCropChange,
	onZoomChange,
	onCropComplete,
	handleCropApply,
	setShowCrop,
	setImageSrc,
}: AnggotaFormProps) {
	const form = useFormContext();

	return (
		<ScrollArea className="h-[60vh] sm:h-96 w-full p-4">
			<div className="space-y-4">
				<FormField
					control={form.control}
					name="foto"
					render={() => (
						<FormItem>
							<FormLabel>Foto</FormLabel>
							<div className="flex flex-col items-start sm:items-center gap-4">
								{showCrop ? (
									<div className="relative w-full sm:w-80 h-80 bg-gray-100 rounded-md overflow-hidden">
										<Cropper
											image={imageSrc || ""}
											crop={crop}
											zoom={zoom}
											aspect={1}
											onCropChange={onCropChange}
											onZoomChange={onZoomChange}
											onCropComplete={onCropComplete}
										/>
										<div className="absolute bottom-4 left-4 right-4 flex gap-2">
											<Button
												type="button"
												onClick={handleCropApply}
												size="sm"
												className="flex-1"
											>
												Terapkan Crop
											</Button>
											<Button
												type="button"
												onClick={() => setShowCrop(false)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												Batal
											</Button>
										</div>
										<div className="absolute top-4 right-4">
											<input
												type="range"
												min={1}
												max={3}
												step={0.1}
												value={zoom}
												onChange={(e) => onZoomChange(Number(e.target.value))}
												className="w-20"
											/>
										</div>
									</div>
								) : fotoPreview ? (
									<div className="relative">
										<Image
											src={fotoPreview}
											alt="Preview Foto"
											width={80}
											height={80}
											className="rounded-md object-cover"
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
											onClick={() => {
												setImageSrc(fotoPreview);
												setShowCrop(true);
											}}
										>
											<Edit className="h-3 w-3" />
										</Button>
									</div>
								) : (
									<div className="h-20 w-20 rounded-md bg-secondary"></div>
								)}
								<FormControl>
									<Input
										type="file"
										accept="image/*"
										className="max-w-xs"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												const reader = new FileReader();
												reader.onloadend = () => {
													setImageSrc(reader.result as string);
													setShowCrop(true);
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
								<Input type="email" placeholder="contoh@email.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{!isEditMode && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="******" {...field} />
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
										<Input type="password" placeholder="******" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				)}
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
										<SelectItem value="Sabuk Kuning">Sabuk Kuning</SelectItem>
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
	);
}
