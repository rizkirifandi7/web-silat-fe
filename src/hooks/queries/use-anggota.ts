/**
 * Anggota (Member) API Hooks (OPTIMIZED)
 * React Query hooks for managing member data
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils";
import { Anggota } from "@/lib/schema";
import { toast } from "sonner";

// ==================== QUERY HOOKS ====================

/**
 * Get all anggota (members)
 * Cached for 2 minutes
 */
export function useAnggota() {
	return useQuery<Anggota[]>({
		queryKey: ["anggota"],
		queryFn: async () => {
			const response = await api.get<Anggota[]>("/anggota");
			return response.data;
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

/**
 * Get single anggota by ID
 */
export function useAnggotaById(id: number | string) {
	return useQuery<Anggota>({
		queryKey: ["anggota", id],
		queryFn: async () => {
			const response = await api.get<Anggota>(`/anggota/${id}`);
			return response.data;
		},
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

/**
 * Get anggota statistics
 */
export function useAnggotaStats() {
	return useQuery({
		queryKey: ["anggota", "stats"],
		queryFn: async () => {
			const response = await api.get("/anggota/stats");
			return response.data;
		},
		staleTime: 5 * 60 * 1000,
	});
}

// ==================== MUTATION HOOKS ====================

/**
 * Create new anggota
 */
export function useCreateAnggota() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<Anggota>) => {
			const response = await api.post<Anggota>("/anggota", data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
			toast.success("Anggota berhasil ditambahkan");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal menambahkan anggota");
		},
	});
}

/**
 * Update existing anggota
 */
export function useUpdateAnggota() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: number | string;
			data: FormData | Partial<Anggota>;
		}) => {
			const response = await api.put<Anggota>(`/anggota/${id}`, data);
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
			queryClient.invalidateQueries({ queryKey: ["anggota", variables.id] });
			toast.success("Anggota berhasil diupdate");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal mengupdate anggota");
		},
	});
}

/**
 * Delete anggota with optimistic update
 */
export function useDeleteAnggota() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number | string) => {
			await api.delete(`/anggota/${id}`);
			return id;
		},
		onMutate: async (id) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["anggota"] });

			// Snapshot previous value
			const previousAnggota = queryClient.getQueryData<Anggota[]>(["anggota"]);

			// Optimistically remove from list
			if (previousAnggota) {
				queryClient.setQueryData<Anggota[]>(
					["anggota"],
					previousAnggota.filter((item) => item.id !== Number(id))
				);
			}

			return { previousAnggota };
		},
		onError: (error: Error, _, context) => {
			// Rollback on error
			if (context?.previousAnggota) {
				queryClient.setQueryData(["anggota"], context.previousAnggota);
			}
			toast.error(error.message || "Gagal menghapus anggota");
		},
		onSuccess: () => {
			toast.success("Anggota berhasil dihapus");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
		},
	});
}

/**
 * Bulk update anggota
 */
export function useBulkUpdateAnggota() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { ids: number[]; updates: Partial<Anggota> }) => {
			const response = await api.post("/anggota/bulk-update", data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anggota"] });
			toast.success("Bulk update berhasil");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal melakukan bulk update");
		},
	});
}
