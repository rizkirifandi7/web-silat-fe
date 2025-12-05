/**
 * Campaign CRUD Hook (REFACTORED)
 * Uses React Query hooks for state management
 * Replaces manual useState/useEffect with caching
 */

"use client";

import { useState } from "react";
import {
	useCampaigns,
	useCreateCampaign,
	useUpdateCampaign,
	useDeleteCampaign,
	useUploadCampaignImage,
	type Campaign,
	type CreateCampaignPayload,
	type UpdateCampaignPayload,
} from "@/hooks/queries/use-campaigns";

export function useCampaignCrud() {
	// Dialog states (UI state only)
	const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	
	// Search/filter states
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string | undefined>(undefined);

	// React Query hooks (replaces manual useState + useEffect)
	const { data: campaignsData, isLoading: loading, refetch } = useCampaigns({
		page,
		limit: 10,
		search: search || undefined,
		status,
		sort_by: "created_at",
		sort_order: "DESC",
	});

	const createMutation = useCreateCampaign();
	const updateMutation = useUpdateCampaign();
	const deleteMutation = useDeleteCampaign();
	const uploadImageMutation = useUploadCampaignImage();

	// Extract data from React Query response
	const campaigns = campaignsData?.campaigns || [];
	const pagination = campaignsData?.pagination || {
		total: 0,
		page: 1,
		limit: 10,
		total_pages: 0,
	};

	// Fetch campaigns (now just triggers refetch)
	const fetchCampaigns = async (params?: {
		page?: number;
		search?: string;
		status?: string;
	}) => {
		if (params?.page) setPage(params.page);
		if (params?.search !== undefined) setSearch(params.search);
		if (params?.status !== undefined) setStatus(params.status);
		await refetch();
	};

	// Create campaign
	const handleCreate = async (data: CreateCampaignPayload): Promise<boolean> => {
		try {
			await createMutation.mutateAsync(data);
			setIsDialogOpen(false);
			return true;
		} catch (error) {
			return false;
		}
	};

	// Update campaign
	const handleUpdate = async (
		id: number,
		data: UpdateCampaignPayload
	): Promise<boolean> => {
		try {
			await updateMutation.mutateAsync({ id, data });
			setIsDialogOpen(false);
			setSelectedCampaign(null);
			return true;
		} catch (error) {
			return false;
		}
	};

	// Delete campaign
	const handleDelete = async (): Promise<boolean> => {
		if (!selectedCampaign) return false;

		try {
			await deleteMutation.mutateAsync(selectedCampaign.id);
			setIsDeleteDialogOpen(false);
			setSelectedCampaign(null);
			return true;
		} catch (error) {
			return false;
		}
	};

	// Upload image
	const handleUploadImage = async (file: File): Promise<string | null> => {
		try {
			const imageUrl = await uploadImageMutation.mutateAsync(file);
			return imageUrl;
		} catch (error) {
			return null;
		}
	};

	// Open create dialog
	const openCreateDialog = () => {
		setSelectedCampaign(null);
		setIsDialogOpen(true);
	};

	// Open edit dialog
	const openEditDialog = (campaign: Campaign) => {
		setSelectedCampaign(campaign);
		setIsDialogOpen(true);
	};

	// Open delete dialog
	const openDeleteDialog = (campaign: Campaign) => {
		setSelectedCampaign(campaign);
		setIsDeleteDialogOpen(true);
	};

	// Close dialog and reset selected campaign
	const handleDialogClose = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setSelectedCampaign(null);
		}
	};

	return {
		// Data (from React Query)
		campaigns,
		loading,
		pagination,
		
		// UI state
		selectedCampaign,
		isDialogOpen,
		isDeleteDialogOpen,
		setIsDialogOpen,
		setIsDeleteDialogOpen,
		handleDialogClose,
		
		// Actions
		fetchCampaigns,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleUploadImage,
		openCreateDialog,
		openEditDialog,
		openDeleteDialog,
	};
}
