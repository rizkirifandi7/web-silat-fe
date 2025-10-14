"use client";
import { useState } from "react";
import useSWR from "swr";
import {
	getMateriByCourse,
	createMateri,
	updateMateri,
	deleteMateri,
} from "@/lib/materi-api";
import { materiFormSchema } from "@/lib/schema";
import { z } from "zod";

type MateriFormValues = z.infer<typeof materiFormSchema>;

export function useMateriCRUD(id_course: string) {
	const {
		data: materi,
		error,
		mutate,
	} = useSWR(
		id_course ? ["courses", id_course] : null,
		() => getMateriByCourse(id_course),
		{
			revalidateOnFocus: false,
		}
	);

	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleCreate = async (data: MateriFormValues) => {
		setIsCreating(true);
		try {
			const formData = new FormData();
			formData.append("judul", data.judul);
			formData.append("tipeKonten", data.tipeKonten);
			formData.append("id_course", id_course);

			if (data.tipeKonten === "pdf" && data.konten[0] instanceof File) {
				formData.append("konten", data.konten[0]);
			} else {
				formData.append("konten", data.konten);
			}

			await createMateri(formData);
			mutate();
		} catch (error) {
			console.error("Failed to create materi:", error);
		} finally {
			setIsCreating(false);
		}
	};

	const handleUpdate = async (id: number, data: Partial<MateriFormValues>) => {
		setIsUpdating(true);
		try {
			const formData = new FormData();
			if (data.judul) formData.append("judul", data.judul);
			if (data.tipeKonten) formData.append("tipeKonten", data.tipeKonten);

			if (data.tipeKonten === "pdf" && data.konten && data.konten[0] instanceof File) {
				formData.append("konten", data.konten[0]);
			} else if (data.konten) {
				formData.append("konten", data.konten as string);
			}

			await updateMateri(id, formData);
			mutate();
		} catch (error) {
			console.error("Failed to update materi:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async (id: number, options?: { onSuccess?: () => void }) => {
		setIsDeleting(true);
		try {
			await deleteMateri(id);
			mutate((currentData) => {
				if (!currentData) return [];
				return currentData.filter((item) => item.id !== id);
			}, false);
			options?.onSuccess?.();
		} catch (error) {
			console.error("Failed to delete materi:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return {
		materi,
		isLoading: !error && !materi,
		isError: error,
		isCreating,
		isUpdating,
		isDeleting,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
}
