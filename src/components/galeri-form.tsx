"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Galeri } from "@/lib/schema";
import { uploadGaleriImage } from "@/lib/galeri-api";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
	judul: z.string().min(1, { message: "Judul tidak boleh kosong." }),
	deskripsi: z.string().min(1, { message: "Deskripsi tidak boleh kosong." }),
	gambar_url: z.string().optional(),
});

type GaleriFormValues = z.infer<typeof formSchema>;

interface GaleriFormProps {
	galeri?: Galeri;
	onSubmit: (data: {
		judul: string;
		deskripsi: string;
		gambar_url?: string;
	}) => Promise<void>;
	onSuccess: () => void;
}

export function GaleriForm({ galeri, onSubmit, onSuccess }: GaleriFormProps) {
	const [preview, setPreview] = useState<string | null>(galeri?.gambar || null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [uploading, setUploading] = useState(false);

	const form = useForm<GaleriFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			judul: galeri?.judul || "",
			deskripsi: galeri?.deskripsi || "",
			gambar_url: galeri?.gambar || "",
		},
	});

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("File harus berupa gambar");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Ukuran file maksimal 5MB");
			return;
		}

		try {
			setUploading(true);
			const imageUrl = await uploadGaleriImage(file);
			form.setValue("gambar_url", imageUrl);
			setPreview(imageUrl);
			toast.success("Gambar berhasil diupload");
		} catch (error) {
			toast.error("Gagal upload gambar");
			console.error(error);
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async (values: GaleriFormValues) => {
		try {
			setIsSubmitting(true);
			await onSubmit({
				judul: values.judul,
				deskripsi: values.deskripsi,
				gambar_url: values.gambar_url,
			});
			onSuccess();
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="judul"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Judul</FormLabel>
							<FormControl>
								<Input placeholder="Judul gambar" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="deskripsi"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Deskripsi</FormLabel>
							<FormControl>
								<Textarea placeholder="Deskripsi singkat" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="gambar_url"
					render={() => (
						<FormItem>
							<FormLabel>Gambar *</FormLabel>
							<div className="border-2 border-dashed rounded-lg p-4">
								{preview ? (
									<div className="relative">
										<Image
											src={preview}
											alt="Preview"
											width={400}
											height={200}
											className="w-full h-48 object-cover rounded"
										/>
										<Button
											type="button"
											variant="destructive"
											size="icon"
											className="absolute top-2 right-2"
											onClick={() => {
												setPreview(null);
												form.setValue("gambar_url", "");
											}}
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								) : (
									<div className="text-center">
										<Upload className="mx-auto h-12 w-12 text-muted-foreground" />
										<div className="mt-2">
											<label htmlFor="image-upload">
												<Button
													type="button"
													variant="outline"
													disabled={uploading}
													onClick={() =>
														document.getElementById("image-upload")?.click()
													}
												>
													{uploading ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Uploading...
														</>
													) : (
														"Upload Gambar"
													)}
												</Button>
											</label>
											<input
												id="image-upload"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleImageUpload}
												disabled={uploading}
											/>
											<p className="text-xs text-muted-foreground mt-2">
												PNG, JPG, JPEG up to 5MB
											</p>
										</div>
									</div>
								)}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isSubmitting || uploading}>
					{isSubmitting
						? "Menyimpan..."
						: galeri
						? "Simpan Perubahan"
						: "Tambah"}
				</Button>
			</form>
		</Form>
	);
}
