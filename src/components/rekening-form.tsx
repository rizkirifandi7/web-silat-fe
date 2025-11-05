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
import { Rekening } from "@/lib/schema";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
	logo: z.any().optional(),
	namaPemilik: z
		.string()
		.min(1, { message: "Nama pemilik tidak boleh kosong." }),
	namaBank: z.string().min(1, { message: "Nama bank tidak boleh kosong." }),
	noRekening: z
		.string()
		.min(1, { message: "Nomor rekening tidak boleh kosong." }),
});

type RekeningFormValues = z.infer<typeof formSchema>;

interface RekeningFormProps {
	rekening?: Rekening;
	onSubmit: (formData: FormData) => Promise<void>;
	onSuccess: () => void;
}

export function RekeningForm({
	rekening,
	onSubmit,
	onSuccess,
}: RekeningFormProps) {
	const [preview, setPreview] = useState<string | null>(rekening?.logo || null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<RekeningFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			logo: undefined,
			namaPemilik: rekening?.namaPemilik || "",
			namaBank: rekening?.namaBank || "",
			noRekening: rekening?.noRekening || "",
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			form.setValue("logo", file);
		}
	};

	const handleSubmit = async (values: RekeningFormValues) => {
		const formData = new FormData();
		if (values.logo instanceof File) {
			formData.append("logo", values.logo);
		}
		formData.append("namaPemilik", values.namaPemilik);
		formData.append("namaBank", values.namaBank);
		formData.append("noRekening", values.noRekening);

		try {
			setIsSubmitting(true);
			await onSubmit(formData);
			onSuccess();
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				{preview && (
					<div className="w-32 h-32 relative">
						<Image
							src={preview}
							alt="Logo Preview"
							width={200}
							height={200}
							className="w-full h-auto rounded-md"
						/>
					</div>
				)}
				<FormField
					name="logo"
					render={() => (
						<FormItem>
							<FormLabel>Logo</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="namaBank"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nama Bank</FormLabel>
							<FormControl>
								<Input placeholder="Nama Bank" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="namaPemilik"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nama Pemilik</FormLabel>
							<FormControl>
								<Input placeholder="Nama Pemilik" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="noRekening"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nomor Rekening</FormLabel>
							<FormControl>
								<Input placeholder="Nomor Rekening" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? "Mengirim..."
						: rekening
						? "Simpan Perubahan"
						: "Tambah"}
				</Button>
			</form>
		</Form>
	);
}
