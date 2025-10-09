import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAnggota,
	deleteAnggota,
	getAnggotas,
	updateAnggota,
} from "@/lib/anggota-api";
import { Anggota } from "@/lib/schema";
import { toast } from "sonner";

type CreateAnggotaParams = {
	data: FormData;
	onSuccess?: () => void;
};

type UpdateAnggotaParams = {
	id: number;
	data: FormData;
	onSuccess?: () => void;
};

export function useAnggotaCrud() {
	const queryClient = useQueryClient();

	const {
		data: anggotas,
		isLoading: isLoadingAnggotas,
		isError: isErrorAnggotas,
	} = useQuery({
		queryKey: ["anggota"],
		queryFn: getAnggotas,
	});

	const { mutate: addAnggota, isPending: isAdding } = useMutation<
		Anggota,
		Error,
		CreateAnggotaParams
	>({
		mutationFn: ({ data }) => createAnggota(data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
			toast.success(`Anggota berhasil ditambahkan`);
			variables.onSuccess?.();
		},
		onError: (error) => {
			toast.error("Gagal menambahkan anggota: " + error.message);
		},
	});

	const { mutate: editAnggota, isPending: isEditing } = useMutation<
		Anggota,
		Error,
		UpdateAnggotaParams
	>({
		mutationFn: ({ id, data }) => updateAnggota(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
			toast.success(`Anggota berhasil diubah`);
			variables.onSuccess?.();
		},
		onError: (error) => {
			toast.error("Gagal mengubah anggota: " + error.message);
		},
	});

	const { mutate: removeAnggota, isPending: isDeleting } = useMutation<
		void,
		Error,
		number
	>({
		mutationFn: deleteAnggota,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
			toast.success("Anggota berhasil dihapus");
		},
		onError: (error) => {
			toast.error("Gagal menghapus anggota: " + error.message);
		},
	});

	return {
		anggotas,
		isLoadingAnggotas,
		isErrorAnggotas,
		addAnggota,
		isAdding,
		editAnggota,
		isEditing,
		removeAnggota,
		isDeleting,
	};
}
