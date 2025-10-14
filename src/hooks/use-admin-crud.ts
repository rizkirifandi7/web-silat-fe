import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAdmin,
	deleteAdmin,
	getAdmins,
	updateAdmin,
} from "@/lib/admin-api";
import { AdminData, CreateAdminData } from "@/lib/schema";
import { toast } from "sonner";

export function useAdminCrud() {
	const queryClient = useQueryClient();

	const {
		data: admins,
		isLoading: isLoadingAdmins,
		isError: isErrorAdmins,
	} = useQuery({
		queryKey: ["admins"],
		queryFn: getAdmins,
	});

	const { mutate: addAdmin, isPending: isAdding } = useMutation<
		AdminData,
		Error,
		CreateAdminData
	>({
		mutationFn: createAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			toast.success(`Admin berhasil ditambahkan`);
		},
		onError: (error) => {
			toast.error("Gagal menambahkan admin: " + error.message);
		},
	});

	const { mutate: editAdmin, isPending: isEditing } = useMutation<
		AdminData,
		Error,
		{ id: number; data: Partial<CreateAdminData> }
	>({
		mutationFn: ({ id, data }) => updateAdmin(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			toast.success(`Admin berhasil diubah`);
		},
		onError: (error) => {
			toast.error("Gagal mengubah admin: " + error.message);
		},
	});

	const { mutate: removeAdmin, isPending: isDeleting } = useMutation<
		void,
		Error,
		number,
		{ onSuccess?: () => void }
	>({
		mutationFn: deleteAdmin,
		onSuccess: (_, __, context) => {
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			toast.success("Admin berhasil dihapus");
			if (context.onSuccess) {
				context.onSuccess();
			}
		},
		onError: (error) => {
			toast.error("Gagal menghapus admin: " + error.message);
		},
	});

	return {
		admins,
		isLoadingAdmins,
		isErrorAdmins,
		addAdmin,
		isAdding,
		editAdmin,
		isEditing,
		removeAdmin,
		isDeleting,
	};
}
