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
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createKategoriMateri, updateKategoriMateri } from "@/lib/kategori-materi-api";
import { KategoriMateri } from "@/lib/schema";

const formSchema = z.object({
	judul: z.string().min(1, { message: "Judul tidak boleh kosong." }),
	deskripsi: z.string().min(1, { message: "Deskripsi tidak boleh kosong." }),
});

type KategoriMateriFormValues = z.infer<typeof formSchema>;

interface KategoriMateriFormProps {
	kategori?: KategoriMateri;
	onSuccess?: () => void;
}

export default function KategoriMateriForm({
	kategori,
	onSuccess,
}: KategoriMateriFormProps) {
	const router = useRouter();
	const form = useForm<KategoriMateriFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			judul: kategori?.judul || "",
			deskripsi: kategori?.deskripsi || "",
		},
	});

	const {
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: KategoriMateriFormValues) => {
		try {
			if (kategori) {
				await updateKategoriMateri(kategori.id, data);
				toast.success("Kategori materi berhasil diperbarui.");
			} else {
				await createKategoriMateri(data);
				toast.success("Kategori materi berhasil ditambahkan.");
			}
			if (onSuccess) {
				onSuccess();
			}
			router.refresh();
		} catch (error) {
			const e = error as Error;
			toast.error(e.message || "Gagal menyimpan kategori materi.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="judul"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Judul Kategori</FormLabel>
							<FormControl>
								<Input placeholder="Masukkan judul kategori" {...field} />
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
								<Textarea
									placeholder="Masukkan deskripsi kategori"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Menyimpan..." : "Simpan"}
				</Button>
			</form>
		</Form>
	);
}
