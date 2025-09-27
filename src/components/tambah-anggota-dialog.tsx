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
import { useState } from "react";
import { AnggotaForm } from "./anggota-form"; // Import komponen form baru

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

type FormData = z.infer<typeof FormSchema>;

export function TambahAnggotaDialog({
	isOpen,
	onOpenChange,
	onAnggotaAdded,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onAnggotaAdded: (data: Anggota) => void;
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

	const form = useForm<FormData>({
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

	const resetFormState = () => {
		form.reset();
		setFotoPreview(null);
		setShowCrop(false);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		setImageSrc(null);
	};

	async function onSubmit(values: FormData) {
		setIsSubmitting(true);
		const formData = new FormData();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword, ...restValues } = values;
		Object.entries(restValues).forEach(([key, value]) => {
			if (key === "foto" && value instanceof File) {
				formData.append(key, value);
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
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal menambahkan anggota.");
			}

			const result = await response.json();

			// The API response on success doesn't seem to return the created user.
			// We'll use the form data to optimistically update the UI.
			const newAnggotaFromForm: Anggota = {
				...values,
				id: Date.now(), // Temporary ID for UI update
				id_token: "", // Not available from form
				role: "Anggota", // Default role
				foto: fotoPreview || "", // Use previewed photo
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			const parsedAnggota = anggotaSchema.parse(newAnggotaFromForm);

			onAnggotaAdded(parsedAnggota);
			resetFormState();
			toast.success(result.message || "Anggota berhasil ditambahkan!");
			onOpenChange(false);
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
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					resetFormState();
				}
				onOpenChange(open);
			}}
		>
			<DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Tambah Anggota Baru</DialogTitle>
					<DialogDescription>
						Isi formulir di bawah ini untuk menambahkan anggota baru.
					</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<AnggotaForm
							isEditMode={false}
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
						<DialogFooter className="pt-4">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Menyimpan..." : "Simpan"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
