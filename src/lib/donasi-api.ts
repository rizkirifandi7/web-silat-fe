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

		// API returns { data: { campaigns: [...] } }
		return response.data.data.campaigns || [];
	} catch (error) {
		console.error("Error fetching campaigns:", error);
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
		// API returns { data: { campaign: {...} } }
		return response.data.data?.campaign || response.data.data || null;
	} catch (error) {
		console.error(`Error fetching campaign with slug ${slug}:`, error);
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

		// API returns { data: { payment_methods: [...] } }
		return response.data.data?.payment_methods || response.data.data || [];
	} catch (error) {
		console.error("Error fetching payment methods:", error);
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
		console.log("💳 Creating donation with payload:", payload);
		const response = await api.post("/payment/donation", payload);
		console.log("📦 Donation API Response:", response.data);
		
		// API returns { data: { ... } }
		const result = response.data.data || response.data;
		console.log("✅ Parsed donation result:", result);
		
		if (!result.snap_token) {
			console.error("❌ BACKEND ERROR: snap_token not found in response:", result);
			console.error(`
╔════════════════════════════════════════════════════════════════╗
║                    BACKEND CONFIGURATION ERROR                  ║
╠════════════════════════════════════════════════════════════════╣
║ Response hanya berisi: donation_id, transaction_id, total_amount ║
║ Response HARUS berisi juga: snap_token, redirect_url           ║
║                                                                 ║
║ BACKEND perlu:                                                  ║
║ 1. Install Midtrans SDK di backend                            ║
║ 2. Configure Midtrans Server Key                              ║
║ 3. Call Midtrans Snap API untuk generate snap_token           ║
║ 4. Return snap_token dalam response                           ║
║                                                                 ║
║ Dokumentasi: https://docs.midtrans.com/reference/createtransaction ║
╚════════════════════════════════════════════════════════════════╝
			`);
			
			throw new Error(
				"Backend belum mengintegrasikan Midtrans Snap API. " +
				"Response tidak mengandung snap_token. " +
				"Silakan hubungi backend developer untuk mengintegrasikan Midtrans. " +
				`Response: ${JSON.stringify(result)}`
			);
		}
		
		return result;
	} catch (error) {
		console.error("❌ Error creating donation:", error);
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
		console.log(`🔍 Checking donation status for: ${transactionId}`);
		const response = await api.get(
			`/payment/donation/status/${transactionId}`
		);
		console.log("📦 Raw API Response:", response.data);
		
		// API returns { status: 'success', data: { donation: {...} } }
		const result = response.data;
		
		if (result.data && result.data.donation) {
			console.log("✅ Donation data found:", result.data.donation);
			return result;
		}
		
		// Fallback for different response structure
		if (result.donation) {
			console.log("✅ Donation found (alternative structure):", result.donation);
			return { status: 'success', data: result };
		}
		
		console.warn("⚠️ Unexpected response structure:", result);
		return result;
	} catch (error) {
		console.error("❌ Error checking donation status:", error);
		handleApiError(error, "Failed to check donation status");
		throw error;
	}
};

