/**
 * React Query Hooks for Campaign Management
 * Handles campaigns CRUD operations with optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllCampaigns,
	getCampaignById,
	getCampaignBySlug,
	createCampaign,
	updateCampaign,
	deleteCampaign,
} from "@/lib/campaign-api";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import type { Campaign, CreateCampaignPayload, UpdateCampaignPayload } from "@/lib/campaign-api";

/**
 * Get all campaigns with filters
 */
export function useCampaigns(params?: {
	status?: string;
	category?: string;
	search?: string;
	is_published?: boolean;
	page?: number;
	limit?: number;
	sort_by?: string;
	sort_order?: "ASC" | "DESC";
}) {
	return useQuery({
		queryKey: ["campaigns", params],
		queryFn: () => getAllCampaigns(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

/**
 * Get campaign by ID
 */
export function useCampaign(id: number) {
	return useQuery({
		queryKey: ["campaigns", id],
		queryFn: () => getCampaignById(id),
		enabled: !!id,
	});
}

/**
 * Get campaign by slug
 */
export function useCampaignBySlug(slug: string) {
	return useQuery({
		queryKey: ["campaigns", "slug", slug],
		queryFn: () => getCampaignBySlug(slug),
		enabled: !!slug,
		staleTime: 5 * 60 * 1000, // 5 minutes for public pages
	});
}

/**
 * Create new campaign
 */
export function useCreateCampaign() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCampaignPayload) => createCampaign(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			toast.success("Campaign created successfully");
		},
		onError: (error) => {
		},
	});
}

/**
 * Update existing campaign
 */
export function useUpdateCampaign() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateCampaignPayload }) =>
			updateCampaign(id, data),
		onSuccess: (data, variables) => {
			// Invalidate list and specific campaign
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", variables.id] });
			toast.success("Campaign updated successfully");
		},
		onError: (error) => {
		},
	});
}

/**
 * Delete campaign with optimistic update
 */
export function useDeleteCampaign() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteCampaign(id),
		// Optimistic update
		onMutate: async (id) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["campaigns"] });

			// Snapshot previous value
			const previousCampaigns = queryClient.getQueryData(["campaigns"]);

			// Optimistically update to the new value
			queryClient.setQueryData(["campaigns"], (old: unknown) => {
				if (!old || typeof old !== "object" || !('data' in old)) return old;
				const data = old.data as { campaigns?: Campaign[] };
				if (!data.campaigns) return old;
				return {
					...old,
					data: {
						...data,
						campaigns: data.campaigns.filter((c: Campaign) => c.id !== id),
					},
				};
			});

			return { previousCampaigns };
		},
		onError: (err, id, context) => {
			// Rollback on error
			if (context?.previousCampaigns) {
				queryClient.setQueryData(["campaigns"], context.previousCampaigns);
			}
		},
		onSettled: () => {
			// Refetch to ensure data consistency
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			toast.success("Campaign deleted successfully");
		},
	});
}

/**
 * Upload campaign image
 */
export function useUploadCampaignImage() {
	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("image", file);

			const response = await api.post("/donasi/campaigns/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data.data.image_url;
		},
		onSuccess: () => {
			toast.success("Gambar berhasil diupload");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal mengupload gambar");
		},
	});
}

// Export types
export type { Campaign, CreateCampaignPayload, UpdateCampaignPayload };
