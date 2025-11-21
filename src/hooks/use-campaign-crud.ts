"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
	getAllCampaigns,
	createCampaign,
	updateCampaign,
	deleteCampaign,
	uploadCampaignImage,
	type Campaign,
	type CreateCampaignPayload,
	type UpdateCampaignPayload,
} from "@/lib/campaign-api";

export function useCampaignCrud() {
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		total_pages: 0,
	});

	// Fetch campaigns
	const fetchCampaigns = async (params?: {
		page?: number;
		search?: string;
		status?: string;
	}) => {
		try {
			setLoading(true);
			const response = await getAllCampaigns({
				page: params?.page || pagination.page,
				limit: pagination.limit,
				search: params?.search,
				status: params?.status,
				sort_by: "created_at",
				sort_order: "DESC",
			});

			if (response.status === "success") {
				console.log("Fetched campaigns:", response.data.campaigns);
				setCampaigns(response.data.campaigns);
				setPagination(response.data.pagination);
			}
		} catch (error) {
			console.error("Error fetching campaigns:", error);
			toast.error("Gagal memuat data campaign");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCampaigns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Create campaign
	const handleCreate = async (data: CreateCampaignPayload) => {
		try {
			console.log("Creating campaign with data:", data);
			const response = await createCampaign(data);
			console.log("Create campaign response:", response);
			if (response.status === "success") {
				toast.success("Campaign berhasil dibuat");
				fetchCampaigns();
				setIsDialogOpen(false);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error creating campaign:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Gagal membuat campaign";
			toast.error(errorMessage);
			return false;
		}
	};

	// Update campaign
	const handleUpdate = async (
		id: number,
		data: UpdateCampaignPayload
	) => {
		try {
			const response = await updateCampaign(id, data);
			if (response.status === "success") {
				toast.success("Campaign berhasil diupdate");
				fetchCampaigns();
				setIsDialogOpen(false);
				setSelectedCampaign(null);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error updating campaign:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Gagal mengupdate campaign";
			toast.error(errorMessage);
			return false;
		}
	};

	// Delete campaign
	const handleDelete = async (): Promise<boolean> => {
		if (!selectedCampaign) return false;

		try {
			const response = await deleteCampaign(selectedCampaign.id);
			if (response.status === "success") {
				toast.success("Campaign berhasil dihapus");
				fetchCampaigns();
				setIsDeleteDialogOpen(false);
				setSelectedCampaign(null);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error deleting campaign:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Gagal menghapus campaign";
			toast.error(errorMessage);
			return false;
		}
	};

	// Upload image
	const handleUploadImage = async (file: File): Promise<string | null> => {
		try {
			const response = await uploadCampaignImage(file);
			if (response.status === "success") {
				toast.success("Gambar berhasil diupload");
				return response.data.image_url;
			}
			return null;
		} catch (error) {
			console.error("Error uploading image:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Gagal mengupload gambar";
			toast.error(errorMessage);
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

	return {
		campaigns,
		loading,
		selectedCampaign,
		isDialogOpen,
		isDeleteDialogOpen,
		pagination,
		setIsDialogOpen,
		setIsDeleteDialogOpen,
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
