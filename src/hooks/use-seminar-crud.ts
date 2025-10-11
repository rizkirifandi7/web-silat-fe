"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	getSeminars,
	createSeminar,
	updateSeminar,
	deleteSeminar,
} from "@/lib/seminar-api";
import { Seminar } from "@/types/seminar";
import { toast } from "sonner";

const seminarSchema = z.object({
	judul: z.string().min(1, "Judul tidak boleh kosong"),
	deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong"),
	tanggal_mulai: z.date(),
	tanggal_selesai: z.date(),
	waktu_mulai: z.string().min(1, "Waktu mulai tidak boleh kosong"),
	waktu_selesai: z.string().min(1, "Waktu selesai tidak boleh kosong"),
	lokasi: z.string().min(1, "Lokasi tidak boleh kosong"),
	link_acara: z.string().url("Link acara tidak valid").optional().or(z.literal("")),
	harga: z.number().min(0, "Harga tidak boleh negatif"),
	kuota: z.number().min(0, "Kuota tidak boleh negatif"),
	status: z.enum(["Akan Datang", "Berlangsung", "Selesai"]),
	gambar: z.any().optional(),
	gambar_banner: z.any().optional(),
});

export type SeminarFormValues = z.infer<typeof seminarSchema>;

export function useSeminarCrud() {
	const queryClient = useQueryClient();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);

	const {
		data,
		isLoading,
		error,
	} = useQuery<Seminar[], Error>({
		queryKey: ["seminars"],
		queryFn: getSeminars,
	});

	const form = useForm<SeminarFormValues>({
		resolver: zodResolver(seminarSchema),
		defaultValues: {
			judul: "",
			deskripsi: "",
			tanggal_mulai: new Date(),
			tanggal_selesai: new Date(),
			waktu_mulai: "",
			waktu_selesai: "",
			lokasi: "",
			link_acara: "",
			harga: 0,
			kuota: 0,
			status: "Akan Datang",
		},
	});

	const { mutate: createMutation, isPending: isSubmitting } = useMutation({
		mutationFn: createSeminar,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seminars"] });
			toast.success("Seminar berhasil ditambahkan");
			setIsCreateDialogOpen(false);
			form.reset();
		},
		onError: (error) => {
			toast.error("Gagal menambahkan seminar: " + error.message);
		},
	});

	const { mutate: updateMutation, isPending: isUpdating } = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Seminar> }) =>
			updateSeminar(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seminars"] });
			toast.success("Seminar berhasil diperbarui");
			setIsEditDialogOpen(false);
			setSelectedSeminar(null);
		},
		onError: (error) => {
			toast.error("Gagal memperbarui seminar: " + error.message);
		},
	});

	const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
		mutationFn: deleteSeminar,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seminars"] });
			toast.success("Seminar berhasil dihapus");
			setIsDeleteDialogOpen(false);
			setSelectedSeminar(null);
		},
		onError: (error) => {
			toast.error("Gagal menghapus seminar: " + error.message);
		},
	});

	const onSubmit = (values: SeminarFormValues) => {
		// Handle file uploads here if necessary
		const seminarData = { ...values };
		createMutation(seminarData as Omit<Seminar, "id">);
	};

	const onUpdate = (values: SeminarFormValues) => {
		if (selectedSeminar) {
			updateMutation({ id: selectedSeminar.id, data: values });
		}
	};

	const onDelete = () => {
		if (selectedSeminar) {
			deleteMutation(selectedSeminar.id);
		}
	};

	return {
		data,
		isLoading,
		error,
		form,
		isSubmitting,
		isUpdating,
		isDeleting,
		onSubmit,
		onUpdate,
		onDelete,
		isCreateDialogOpen,
		setIsCreateDialogOpen,
		isEditDialogOpen,
		setIsEditDialogOpen,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		selectedSeminar,
		setSelectedSeminar,
	};
}
