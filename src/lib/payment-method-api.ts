import { api } from "./utils";

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

/**
 * Get all payment methods
 */
export const getAllPaymentMethods = async (params?: {
	channel?: string;
	is_active?: boolean;
}) => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.channel) queryParams.append("channel", params.channel);
		if (params?.is_active !== undefined)
			queryParams.append("is_active", String(params.is_active));

		const url = `/donasi/payment-methods${
			queryParams.toString() ? `?${queryParams.toString()}` : ""
		}`;
		const response = await api.get(url);
		return response.data;
	} catch (error) {
		console.error("Error fetching payment methods:", error);
		throw error;
	}
};

/**
 * Get payment method by ID
 */
export const getPaymentMethodById = async (id: number) => {
	try {
		const response = await api.get(`/donasi/payment-methods/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching payment method:", error);
		throw error;
	}
};

/**
 * Create new payment method
 */
export const createPaymentMethod = async (payload: CreatePaymentMethodPayload) => {
	try {
		const response = await api.post("/donasi/payment-methods", payload);
		return response.data;
	} catch (error) {
		console.error("Error creating payment method:", error);
		throw error;
	}
};

/**
 * Update payment method
 */
export const updatePaymentMethod = async (
	id: number,
	payload: UpdatePaymentMethodPayload
) => {
	try {
		const response = await api.put(`/donasi/payment-methods/${id}`, payload);
		return response.data;
	} catch (error) {
		console.error("Error updating payment method:", error);
		throw error;
	}
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (id: number) => {
	try {
		const response = await api.delete(`/donasi/payment-methods/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting payment method:", error);
		throw error;
	}
};

/**
 * Upload payment method icon
 */
export const uploadPaymentMethodIcon = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append("icon", file);

		const response = await api.post("/donasi/payment-methods/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error uploading icon:", error);
		throw error;
	}
};
