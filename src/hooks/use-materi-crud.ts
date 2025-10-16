"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
	const queryClient = useQueryClient();

	const {
		data: materi,
		error,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["materi", id_course],
		queryFn: () => getMateriByCourse(id_course),
		enabled: !!id_course,
	});

	const { mutateAsync: createMutation, isPending: isCreating } = useMutation({
		mutationFn: createMateri,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["materi", id_course] });
		},
	});

	const { mutateAsync: updateMutation, isPending: isUpdating } = useMutation({
		mutationFn: ({ id, data }: { id: number; data: FormData }) =>
			updateMateri(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["materi", id_course] });
		},
	});

	const { mutateAsync: deleteMutation, isPending: isDeleting } = useMutation({
		mutationFn: deleteMateri,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["materi", id_course] });
		},
	});

	const handleCreate = async (data: MateriFormValues) => {
		try {
			const formData = new FormData();
			formData.append("judul", data.judul);
			formData.append("tipeKonten", data.tipeKonten);
			formData.append("id_course", id_course);

			if (data.tipeKonten === "pdf" && data.konten && data.konten[0] instanceof File) {
				formData.append("konten", data.konten[0]);
			} else if (data.tipeKonten === "video") {
				formData.append("konten", data.konten as string);
			}

			await createMutation(formData);
		} catch (error) {
			console.error("Failed to create materi:", error);
		}
	};

	const handleUpdate = async (
		id: number,
		data: Partial<MateriFormValues>
	) => {
		try {
			const formData = new FormData();
			if (data.judul) formData.append("judul", data.judul);
			if (data.tipeKonten) formData.append("tipeKonten", data.tipeKonten);

			if (
				data.tipeKonten === "pdf" &&
				data.konten &&
				data.konten[0] instanceof File
			) {
				formData.append("konten", data.konten[0]);
			} else if (data.konten) {
				formData.append("konten", data.konten as string);
			}

			await updateMutation({ id, data: formData });
		} catch (error) {
			console.error("Failed to update materi:", error);
		}
	};

	const handleDelete = async (
		id: number,
		options?: { onSuccess?: () => void }
	) => {
		try {
			await deleteMutation(id);
			options?.onSuccess?.();
		} catch (error) {
			console.error("Failed to delete materi:", error);
		}
	};

	return {
		materi,
		isLoading,
		isError,
		error,
		isCreating,
		isUpdating,
		isDeleting,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
}
