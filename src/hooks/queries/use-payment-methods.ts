/**
 * Payment Methods API Hooks (OPTIMIZED)
 * React Query hooks for managing payment methods
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils";
import { toast } from "sonner";

export interface PaymentMethod {
	id: number;
	name: string;
	channel: string;
	midtrans_code?: string;
	icon_url?: string;
	description?: string;
	admin_fee_type: "fixed" | "percentage";
	admin_fee_value: number;
	is_active: boolean;
	sort_order: number;
	created_at: string;
}

export interface CreatePaymentMethodPayload {
	name: string;
	channel: string;
	midtrans_code?: string;
	icon_url?: string;
	description?: string;
	admin_fee_type: "fixed" | "percentage";
	admin_fee_value: number;
	is_active: boolean;
	sort_order: number;
}

export type UpdatePaymentMethodPayload = Partial<CreatePaymentMethodPayload>;

interface PaymentMethodsResponse {
	status: string;
	data: PaymentMethod[];
}

interface PaymentMethodResponse {
	status: string;
	data: PaymentMethod;
}

interface UploadResponse {
	status: string;
	data: {
		icon_url: string;
	};
}

// ==================== QUERY HOOKS ====================

/**
 * Get all payment methods
 * Cached for 5 minutes
 */
export function usePaymentMethods(params?: {
	channel?: string;
	is_active?: boolean;
}) {
	return useQuery<PaymentMethod[]>({
		queryKey: ["payment-methods", params],
		queryFn: async () => {
			const response = await api.get<PaymentMethodsResponse>("/donasi/payment-methods", {
				params,
			});
			return response.data.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

/**
 * Get single payment method by ID
 */
export function usePaymentMethodById(id: number | string) {
	return useQuery<PaymentMethod>({
		queryKey: ["payment-methods", id],
		queryFn: async () => {
			const response = await api.get<PaymentMethodResponse>(`/donasi/payment-methods/${id}`);
			return response.data.data;
		},
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Get active payment methods only
 */
export function useActivePaymentMethods() {
	return useQuery<PaymentMethod[]>({
		queryKey: ["payment-methods", { is_active: true }],
		queryFn: async () => {
			const response = await api.get<PaymentMethodsResponse>("/donasi/payment-methods", {
				params: { is_active: true },
			});
			return response.data.data;
		},
		staleTime: 5 * 60 * 1000,
	});
}

// ==================== MUTATION HOOKS ====================

/**
 * Create new payment method
 */
export function useCreatePaymentMethod() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreatePaymentMethodPayload) => {
			const response = await api.post<PaymentMethodResponse>("/donasi/payment-methods", data);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
			toast.success("Metode pembayaran berhasil dibuat");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal membuat metode pembayaran");
		},
	});
}

/**
 * Update existing payment method
 */
export function useUpdatePaymentMethod() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: number | string;
			data: UpdatePaymentMethodPayload;
		}) => {
			const response = await api.put<PaymentMethodResponse>(
				`/donasi/payment-methods/${id}`,
				data
			);
			return response.data.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
			queryClient.invalidateQueries({ queryKey: ["payment-methods", variables.id] });
			toast.success("Metode pembayaran berhasil diupdate");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal mengupdate metode pembayaran");
		},
	});
}

/**
 * Delete payment method with optimistic update
 */
export function useDeletePaymentMethod() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number | string) => {
			await api.delete(`/donasi/payment-methods/${id}`);
			return id;
		},
		onMutate: async (id) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["payment-methods"] });

			// Snapshot previous value
			const previousPaymentMethods = queryClient.getQueryData<PaymentMethod[]>(["payment-methods"]);

			// Optimistically remove from list
			if (previousPaymentMethods) {
				queryClient.setQueryData<PaymentMethod[]>(
					["payment-methods"],
					previousPaymentMethods.filter((item) => item.id !== Number(id))
				);
			}

			return { previousPaymentMethods };
		},
		onError: (error: Error, _, context) => {
			// Rollback on error
			if (context?.previousPaymentMethods) {
				queryClient.setQueryData(["payment-methods"], context.previousPaymentMethods);
			}
			toast.error(error.message || "Gagal menghapus metode pembayaran");
		},
		onSuccess: () => {
			toast.success("Metode pembayaran berhasil dihapus");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
		},
	});
}

/**
 * Upload payment method icon
 */
export function useUploadPaymentMethodIcon() {
	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("icon", file);

			const response = await api.post<UploadResponse>(
				"/donasi/payment-methods/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data.data.icon_url;
		},
		onSuccess: () => {
			toast.success("Icon berhasil diupload");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal mengupload icon");
		},
	});
}
