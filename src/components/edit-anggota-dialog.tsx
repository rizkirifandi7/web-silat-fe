"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { Anggota, anggotaSchema } from "@/lib/schema";
import { toast } from "sonner";
import Resizer from "react-image-file-resizer";
import { useState, useEffect } from "react";
import { AnggotaForm } from "./anggota-form"; // Import komponen form baru

// Skema hanya untuk data yang bisa diedit di form ini (tanpa password)
const EditFormSchema = anggotaSchema
	.omit({
		id: true,
		role: true,
		id_token: true,
		createdAt: true,
		updatedAt: true,
		foto: true, // Hapus foto asli untuk diganti dengan z.any()
	})
	.extend({
		foto: z.any().optional(),
	});

type EditFormData = z.infer<typeof EditFormSchema>;

export function EditAnggotaDialog({
	anggota,
	isOpen,
	onOpenChange,
	onSuccess,
}: {
	anggota: Anggota | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onSuccess: () => void;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	// State dan logika untuk image cropper
	const [fotoPreview, setFotoPreview] = useState<string | null>(null);
	const [showCrop, setShowCrop] = useState(false);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
		width: number;
		height: number;
		x: number;
		y: number;
	} | null>(null);
	const [imageSrc, setImageSrc] = useState<string | null>(null);

	const onCropComplete = (
		croppedArea: { width: number; height: number; x: number; y: number },
		croppedAreaPixels: { width: number; height: number; x: number; y: number }
	) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const getCroppedImg = (
		imageSrc: string,
		crop: { width: number; height: number; x: number; y: number }
	): Promise<string> => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = imageSrc;
			image.crossOrigin = "anonymous";
			image.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					return reject(new Error("Failed to get canvas context"));
				}

				canvas.width = crop.width;
				canvas.height = crop.height;

				ctx.drawImage(
					image,
					crop.x,
					crop.y,
					crop.width,
					crop.height,
					0,
					0,
					crop.width,
					crop.height
				);

				canvas.toBlob((blob) => {
					if (!blob) {
						return reject(new Error("Failed to create blob"));
					}
					resolve(URL.createObjectURL(blob));
				}, "image/jpeg");
			};
			image.onerror = (error) => reject(error);
		});
	};

	const handleCropApply = async () => {
		if (imageSrc && croppedAreaPixels) {
			try {
				const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
				Resizer.imageFileResizer(
					await (await fetch(croppedImage)).blob(),
					300,
					300,
					"JPEG",
					80,
					0,
					(uri) => {
						if (typeof uri === "string") {
							setFotoPreview(uri);
							setShowCrop(false);
							fetch(uri)
								.then((res) => res.blob())
								.then((blob) => {
									const file = new File([blob], "resized-image.jpg", {
										type: "image/jpeg",
									});
									form.setValue("foto", file);
								});
						}
					},
					"base64"
				);
			} catch (error) {
				console.error("Error cropping image:", error);
				toast.error("Gagal memotong gambar.");
			}
		}
	};

	const form = useForm<EditFormData>({
		resolver: zodResolver(EditFormSchema),
	});

	// Effect untuk me-reset form dan preview saat dialog dibuka atau anggota berubah
	useEffect(() => {
		if (anggota && isOpen) {
			form.reset({
				nama: anggota.nama || "",
				email: anggota.email || "",
				tempat_lahir: anggota.tempat_lahir || "",
				tanggal_lahir: anggota.tanggal_lahir
					? new Date(anggota.tanggal_lahir).toISOString().split("T")[0]
					: "",
				jenis_kelamin: anggota.jenis_kelamin || "Laki-laki",
				alamat: anggota.alamat || "",
				agama: anggota.agama || "Islam",
				no_telepon: anggota.no_telepon || "",
				angkatan_unit: anggota.angkatan_unit || "",
				status_keanggotaan: anggota.status_keanggotaan || "Aktif",
				status_perguruan: anggota.status_perguruan || "Anggota",
				tingkatan_sabuk: anggota.tingkatan_sabuk || "Belum punya",
				foto: anggota.foto,
			});
			setFotoPreview(anggota.foto || null);
			setShowCrop(false);
			setCrop({ x: 0, y: 0 });
			setZoom(1);
			setCroppedAreaPixels(null);
			setImageSrc(null);
		}
	}, [anggota, isOpen, form]);

	if (!anggota) {
		return null;
	}

	async function onSubmit(values: EditFormData) {
		if (!anggota) return;

		setIsSubmitting(true);
		const formData = new FormData();

		Object.entries(values).forEach(([key, value]) => {
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
				`${process.env.NEXT_PUBLIC_API_URL}/anggota/${anggota.id}`,
				{
					method: "PUT",
					body: formData,
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memperbarui anggota.");
			}

			const result = await response.json();
			console.log("Update result:", result);

			onSuccess();
			toast.success("Anggota berhasil diperbarui!");
			onOpenChange(false);
		} catch (error) {
			console.error("Error submitting form:", error);
			if (error instanceof Error) {
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
			<DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Edit Data Anggota</DialogTitle>
					<DialogDescription>
						Isi formulir di bawah ini untuk memperbarui data anggota.
					</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<AnggotaForm
							isEditMode={true}
							fotoPreview={fotoPreview}
							showCrop={showCrop}
							imageSrc={imageSrc}
							crop={crop}
							zoom={zoom}
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={onCropComplete}
							handleCropApply={handleCropApply}
							setShowCrop={setShowCrop}
							setImageSrc={setImageSrc}
						/>
						<DialogFooter className="pt-4 sm:justify-end">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
