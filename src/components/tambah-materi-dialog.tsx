"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { useMateriCRUD } from "@/hooks/use-materi-crud";
import { materiFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function TambahMateriDialog() {
	const { id: id_course } = useParams();
	const { handleCreate, isCreating } = useMateriCRUD(id_course as string);
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof materiFormSchema>>({
		resolver: zodResolver(materiFormSchema),
		defaultValues: {
			judul: "",
			deskripsi: "",
			tipeKonten: "video",
			konten: "",
			tingkatan: "Belum punya",
			id_course: parseInt(id_course as string),
		},
	});

	const tipeKonten = form.watch("tipeKonten");

	const onSubmit = async (values: z.infer<typeof materiFormSchema>) => {
		await handleCreate(values);
		form.reset();
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					Tambah Materi
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tambah Materi</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="judul"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Judul</FormLabel>
									<FormControl>
										<Input placeholder="Judul materi" {...field} />
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
										<Input placeholder="Deskripsi materi" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tingkatan"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tingkatan</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Pilih tingkatan" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Belum punya">Belum punya</SelectItem>
											<SelectItem value="LULUS Binfistal">
												LULUS Binfistal
											</SelectItem>
											<SelectItem value="Sabuk Putih">Sabuk Putih</SelectItem>
											<SelectItem value="Sabuk Kuning">Sabuk Kuning</SelectItem>
											<SelectItem value="Sabuk Hijau">Sabuk Hijau</SelectItem>
											<SelectItem value="Sabuk Merah">Sabuk Merah</SelectItem>
											<SelectItem value="Sabuk Hitam Wiraga 1">
												Sabuk Hitam Wiraga 1
											</SelectItem>
											<SelectItem value="Sabuk Hitam Wiraga 2">
												Sabuk Hitam Wiraga 2
											</SelectItem>
											<SelectItem value="Sabuk Hitam Wiraga 3">
												Sabuk Hitam Wiraga 3
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tipeKonten"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipe Konten</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											form.setValue("konten", ""); // Reset konten value on change
										}}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Pilih tipe konten" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="video">Video</SelectItem>
											<SelectItem value="pdf">PDF</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						{tipeKonten === "video" ? (
							<FormField
								control={form.control}
								name="konten"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Konten</FormLabel>
										<FormControl>
											<Input placeholder="Link konten" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : (
							<FormField
								control={form.control}
								name="konten"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Konten</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="application/pdf"
												onChange={(e) =>
													field.onChange(
														e.target.files ? e.target.files[0] : null
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<Button type="submit" disabled={isCreating}>
							{isCreating ? "Menyimpan..." : "Simpan"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
