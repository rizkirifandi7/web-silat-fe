import { api, handleApiError } from "./utils";
import type {
	Campaign,
	CampaignDetail,
	PaymentMethod,
	CreateDonationPayload,
	CreateDonationResponse,
	CheckDonationStatusResponse,
} from "@/types/donasi";

/**
 * Fetch all active campaigns for landing page
 * GET /donasi/campaigns
 */
export const fetchCampaigns = async (params?: {
	status?: string;
	is_published?: boolean;
	limit?: number;
}): Promise<Campaign[]> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.status) queryParams.append("status", params.status);
		if (params?.is_published !== undefined)
			queryParams.append("is_published", String(params.is_published));
		if (params?.limit) queryParams.append("limit", String(params.limit));

	const url = `/donasi/campaigns${
		queryParams.toString() ? `?${queryParams.toString()}` : ""
	}`;
	const response = await api.get(url);

	// Axios returns { data: { status, message, data: [...], pagination } }
	// So we need response.data.data to get the campaigns array
	return response.data.data || [];
	} catch (error) {
		return [];
	}
};

/**
 * Fetch campaign detail by slug
 * GET /donasi/campaigns/:slug
 */
export const fetchCampaignBySlug = async (
	slug: string
): Promise<CampaignDetail | null> => {
	try {
		const response = await api.get(`/donasi/campaigns/${slug}`);
		// Backend returns { data: {...} } for single item
		return response.data.data || response.data || null;
	} catch (error) {
		return null;
	}
};

/**
 * Fetch campaign detail by ID (admin only)
 * GET /donasi/campaigns/:id (using fetchDonorsByCampaign will get campaign info)
 */
export const fetchCampaignById = async (id: string) => {
	try {
		// We'll get campaign info from the campaigns list or use slug
		const response = await api.get(`/donasi/campaigns`);
		const campaigns = response.data.data || response.data || [];
		const campaign = campaigns.find((c: any) => c.id === parseInt(id));
		return campaign || null;
	} catch (error) {
		return null;
	}
};

/**
 * Fetch all active payment methods
 * GET /donasi/payment-methods
 */
export const fetchPaymentMethods = async (params?: {
	is_active?: boolean;
}): Promise<PaymentMethod[]> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.is_active !== undefined)
			queryParams.append("is_active", String(params.is_active));

	const url = `/donasi/payment-methods${
		queryParams.toString() ? `?${queryParams.toString()}` : ""
	}`;
	const response = await api.get(url);

	// Axios returns { data: { status, message, data: [...], pagination } }
	// So we need response.data.data to get the payment methods array
	return response.data.data || [];
	} catch (error) {
		return [];
	}
};

/**
 * Create a new donation
 * POST /payment/donation
 */
export const createDonation = async (
	payload: CreateDonationPayload
): Promise<CreateDonationResponse> => {
	try {
		const response = await api.post("/payment/donation", payload);
		
		// API returns { data: { ... } }
		const result = response.data.data || response.data;
		
		if (!result.snap_token) {
			throw new Error(
				"Backend belum mengintegrasikan Midtrans Snap API. " +
				"Response tidak mengandung snap_token. " +
				"Silakan hubungi backend developer untuk mengintegrasikan Midtrans. " +
				`Response: ${JSON.stringify(result)}`
			);
		}
		
		return result;
	} catch (error) {
		handleApiError(error, "Failed to create donation");
		throw error;
	}
};

/**
 * Check donation status by transaction ID
 * GET /payment/donation/status/:transaction_id
 */
export const checkDonationStatus = async (
	transactionId: string
): Promise<CheckDonationStatusResponse> => {
	try {
		const response = await api.get(
			`/payment/donation/status/${transactionId}`
		);
		
		// API returns { status: 'success', data: { donation: {...} } }
		const result = response.data;
		
		if (result.data && result.data.donation) {
			return result;
		}
		
		// Fallback for different response structure
		if (result.donation) {
			return { status: 'success', data: result };
		}
		
		return result;
	} catch (error) {
		handleApiError(error, "Failed to check donation status");
		throw error;
	}
};

/**
 * Get all donations (admin only)
 * GET /donasi/donations
 */
export const fetchDonations = async (params?: {
	campaign_id?: string;
	payment_status?: string;
	search?: string;
	page?: number;
	limit?: number;
	sort_by?: string;
	sort_order?: string;
}) => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.campaign_id) queryParams.append("campaign_id", params.campaign_id);
		if (params?.payment_status) queryParams.append("payment_status", params.payment_status);
		if (params?.search) queryParams.append("search", params.search);
		if (params?.page) queryParams.append("page", String(params.page));
		if (params?.limit) queryParams.append("limit", String(params.limit));
		if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
		if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

		const url = `/donasi/donations${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
		const response = await api.get(url);
		return response.data.data || response.data;
	} catch (error) {
		handleApiError(error, "Failed to fetch donations");
		throw error;
	}
};

/**
 * Get donation by ID (admin only)
 * GET /donasi/donations/:id
 */
export const fetchDonationById = async (id: string) => {
	try {
		const response = await api.get(`/donasi/donations/${id}`);
		return response.data.data || response.data;
	} catch (error) {
		handleApiError(error, "Failed to fetch donation detail");
		throw error;
	}
};

/**
 * Get donors by campaign (admin only)
 * GET /donasi/campaigns/:campaign_id/donors
 */
export const fetchDonorsByCampaign = async (
	campaignId: string,
	params?: {
		page?: number;
		limit?: number;
		payment_status?: string;
	}
) => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page) queryParams.append("page", String(params.page));
		if (params?.limit) queryParams.append("limit", String(params.limit));
		if (params?.payment_status) queryParams.append("payment_status", params.payment_status);

		const url = `/donasi/campaigns/${campaignId}/donors${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
		const response = await api.get(url);
		return response.data.data || response.data;
	} catch (error) {
		handleApiError(error, "Failed to fetch donors");
		throw error;
	}
};

/**
 * Get donation statistics (admin only)
 * GET /donasi/donations/statistics
 */
export const fetchDonationStatistics = async (params?: {
	campaign_id?: string;
	start_date?: string;
	end_date?: string;
}) => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.campaign_id) queryParams.append("campaign_id", params.campaign_id);
		if (params?.start_date) queryParams.append("start_date", params.start_date);
		if (params?.end_date) queryParams.append("end_date", params.end_date);

		const url = `/donasi/donations/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
		const response = await api.get(url);
		return response.data.data || response.data;
	} catch (error) {
		handleApiError(error, "Failed to fetch donation statistics");
		throw error;
	}
};

/**
 * Get recent donations (admin only)
 * GET /donasi/donations/recent
 */
export const fetchRecentDonations = async (limit: number = 10) => {
	try {
		const response = await api.get(`/donasi/donations/recent?limit=${limit}`);
		return response.data.data || response.data;
	} catch (error) {
		handleApiError(error, "Failed to fetch recent donations");
		throw error;
	}
};

/**
 * Export donations to CSV (admin only)
 * GET /donasi/donations/export
 */
export const exportDonations = async (params?: {
	campaign_id?: string;
	payment_status?: string;
	start_date?: string;
	end_date?: string;
}) => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.campaign_id) queryParams.append("campaign_id", params.campaign_id);
		if (params?.payment_status) queryParams.append("payment_status", params.payment_status);
		if (params?.start_date) queryParams.append("start_date", params.start_date);
		if (params?.end_date) queryParams.append("end_date", params.end_date);

		const url = `/donasi/donations/export${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
		const response = await api.get(url, { responseType: "blob" });
		
		// Create download link
		const blob = new Blob([response.data], { type: "text/csv" });
		const downloadUrl = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = `donations_${Date.now()}.csv`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(downloadUrl);
		
		return true;
	} catch (error) {
		handleApiError(error, "Failed to export donations");
		throw error;
	}
};

/**
 * Update donation status (admin only)
 * PATCH /donasi/donations/:id/status
 */
export const updateDonationStatus = async (
	id: string,
	data: {
		payment_status: string;
		notes?: string;
	}
) => {
	try {
		const response = await api.patch(`/donasi/donations/${id}/status`, data);
		return response.data.data || response.data;
	} catch (error) {
		handleApiError(error, "Failed to update donation status");
		throw error;
	}
};


