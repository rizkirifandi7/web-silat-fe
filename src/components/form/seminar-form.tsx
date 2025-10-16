"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Seminar, SeminarFormData, seminarFormSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { createSeminar, updateSeminar } from "@/lib/seminar-api";
import { toast } from "sonner";
import TextEditor from "../text-editor";

interface SeminarFormProps {
	seminar?: Seminar;
}

export function SeminarForm({ seminar }: SeminarFormProps) {
	const router = useRouter();
	const form = useForm<SeminarFormData>({
		resolver: zodResolver(seminarFormSchema),
		defaultValues: seminar
			? {
					judul: seminar.judul || "",
					deskripsi: seminar.deskripsi || "",
					tanggal_mulai: seminar.tanggal_mulai || "",
					tanggal_selesai: seminar.tanggal_selesai || "",
					waktu_mulai: seminar.waktu_mulai || "",
					waktu_selesai: seminar.waktu_selesai || "",
					lokasi: seminar.lokasi || "",
					link_acara: seminar.link_acara || "",
					harga: seminar.harga || 0,
					kuota: seminar.kuota || 0,
					status: seminar.status || "Akan Datang",
					gambar: undefined, // Untuk input file, undefined/null di awal tidak apa-apa
					gambar_banner: undefined,
			  }
			: {
					judul: "",
					deskripsi: "",
					tanggal_mulai: "",
					tanggal_selesai: "",
					waktu_mulai: "",
					waktu_selesai: "",
					lokasi: "",
					link_acara: "",
					harga: 0,
					kuota: 0,
					status: "Akan Datang",
					gambar: undefined,
					gambar_banner: undefined,
			  },
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: SeminarFormData) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			const dataKey = key as keyof SeminarFormData;
			if (dataKey === "gambar" || dataKey === "gambar_banner") {
				const file = data[dataKey];
				if (file instanceof File) {
					formData.append(dataKey, file);
				}
			} else {
				formData.append(dataKey, String(data[dataKey]));
			}
		});

		try {
			if (seminar) {
				await updateSeminar(seminar.id, formData);
				toast.success("Berhasil memperbarui seminar.");
			} else {
				await createSeminar(formData);
				toast.success("Berhasil membuat seminar baru.");
			}
			router.push("/dashboard/seminar");
			router.refresh();
		} catch (error) {
			console.error("Failed to save seminar:", error);
			toast.error("Gagal menyimpan seminar.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
				<FormField
					control={control}
					name="judul"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Judul</FormLabel>
							<FormControl>
								<Input placeholder="Judul Seminar" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="deskripsi"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Deskripsi</FormLabel>
							<FormControl>
								<TextEditor
									value={field.value}
									onChange={(editorState) => {
										field.onChange(JSON.stringify(editorState));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="tanggal_mulai"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tanggal Mulai</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="tanggal_selesai"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tanggal Selesai</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="waktu_mulai"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Waktu Mulai</FormLabel>
								<FormControl>
									<Input type="time" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="waktu_selesai"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Waktu Selesai</FormLabel>
								<FormControl>
									<Input type="time" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={control}
					name="lokasi"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Lokasi</FormLabel>
							<FormControl>
								<Input placeholder="Lokasi Seminar" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="link_acara"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Link Acara (Opsional)</FormLabel>
							<FormControl>
								<Input placeholder="https://example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="harga"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Harga</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="0"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value === "" ? "" : Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="kuota"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Kuota</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="0"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value === "" ? "" : Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Pilih status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Akan Datang">Akan Datang</SelectItem>
									<SelectItem value="Berlangsung">Berlangsung</SelectItem>
									<SelectItem value="Selesai">Selesai</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="gambar"
					render={({ field }) => {
						// Destrukturisasi 'value' secara manual untuk dipisahkan
						const { ...restField } = field;

						return (
							<FormItem>
								<FormLabel>Gambar</FormLabel>
								<FormControl>
									<Input
										type="file"
										// '...restField' sekarang tidak lagi mengandung 'value'
										{...restField}
										onChange={(e) => {
											// Kirim file ke react-hook-form
											field.onChange(e.target.files ? e.target.files[0] : null);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<FormField
					control={control}
					name="gambar_banner"
					render={({ field }) => {
						// Lakukan hal yang sama untuk gambar_banner
						const { ...restField } = field;

						return (
							<FormItem>
								<FormLabel>Gambar Banner</FormLabel>
								<FormControl>
									<Input
										type="file"
										{...restField}
										onChange={(e) => {
											field.onChange(e.target.files ? e.target.files[0] : null);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Menyimpan..." : "Simpan"}
				</Button>
			</form>
		</Form>
	);
}

export default SeminarForm;
