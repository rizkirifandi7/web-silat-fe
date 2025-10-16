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
import { Materi } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditMateriDialogProps {
	materi: Materi;
}

export function EditMateriDialog({ materi }: EditMateriDialogProps) {
	const { id: id_course } = useParams();
	const { handleUpdate, isUpdating } = useMateriCRUD(id_course as string);
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof materiFormSchema>>({
		resolver: zodResolver(materiFormSchema),
		defaultValues: {
			judul: materi.judul || "",
			tipeKonten: materi.tipeKonten,
			konten: materi.konten || "",
			id_course: materi.id_course,
		},
	});

	const onSubmit = async (values: z.infer<typeof materiFormSchema>) => {
		await handleUpdate(materi.id, values);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Edit</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Materi</DialogTitle>
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
							name="tipeKonten"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipe Konten</FormLabel>
									<Select
										onValueChange={field.onChange}
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
						<FormField
							control={form.control}
							name="konten"
							render={({ field: { onChange, onBlur, name, ref } }) => (
								<FormItem>
									<FormLabel>Konten</FormLabel>
									<FormControl>
										{form.watch("tipeKonten") === "video" ? (
											<Input
												placeholder="Link konten"
												onChange={onChange}
												onBlur={onBlur}
												name={name}
												ref={ref}
												defaultValue={materi.konten ?? ""}
											/>
										) : (
											<Input
												type="file"
												accept="application/pdf"
												onBlur={onBlur}
												name={name}
												ref={ref}
												onChange={(e) => onChange(e.target.files?.[0])}
											/>
										)}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={isUpdating}>
							{isUpdating ? "Menyimpan..." : "Simpan"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
