import { api } from "./utils";

export interface Campaign {
	id: number;
	title: string;
	slug: string;
	category: string;
	description: string;
	story: string;
	image_url: string;
	target_amount: number;
	collected_amount: number;
	total_supporters: number;
	urgency_level: "low" | "medium" | "high" | "critical";
	status: "draft" | "active" | "completed" | "cancelled";
	is_published: boolean;
	is_urgent: boolean;
	start_date: string;
	end_date: string;
	created_at: string;
	updated_at: string;
	progress_percentage?: number;
	benefits?: CampaignBenefit[];
}

export interface CampaignBenefit {
	id?: number;
	benefit_text: string;
	sort_order: number;
}

export interface CreateCampaignPayload {
	title: string;
	category: string;
	description: string;
	story: string;
	image_url: string;
	target_amount: number;
	urgency_level: "low" | "medium" | "high" | "critical";
	is_published: boolean;
	is_urgent: boolean;
	start_date: string;
	end_date: string;
	benefits?: CampaignBenefit[];
}

export interface UpdateCampaignPayload extends Partial<CreateCampaignPayload> {
	status?: "draft" | "active" | "completed" | "cancelled";
}

/**
 * Get all campaigns
 */
export const getAllCampaigns = async (params?: {
	status?: string;
	category?: string;
	search?: string;
	is_published?: boolean;
	page?: number;
	limit?: number;
	sort_by?: string;
	sort_order?: "ASC" | "DESC";
}) => {
	try {
		const response = await api.get("/donasi/campaigns", { params });
		// Backend returns: { status, message, data: [...], pagination: {...} }
		// Return full object with campaigns and pagination for dashboard
		return {
			campaigns: response.data.data || [],
			pagination: response.data.pagination || { total: 0, page: 1, limit: 10, total_pages: 0 }
		};
	} catch (error) {
		throw error;
	}
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (id: number) => {
	try {
		const response = await api.get(`/donasi/campaigns/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Get campaign by slug
 */
export const getCampaignBySlug = async (slug: string) => {
	try {
		const response = await api.get(`/donasi/campaigns/slug/${slug}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Create new campaign
 */
export const createCampaign = async (payload: CreateCampaignPayload) => {
	try {
		const response = await api.post("/donasi/campaigns", payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Update campaign
 */
export const updateCampaign = async (
	id: number,
	payload: UpdateCampaignPayload
) => {
	try {
		const response = await api.put(`/donasi/campaigns/${id}`, payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (id: number) => {
	try {
		const response = await api.delete(`/donasi/campaigns/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Upload campaign image
 */
export const uploadCampaignImage = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const response = await api.post("/donasi/campaigns/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};
