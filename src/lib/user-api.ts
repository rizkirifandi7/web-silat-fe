/**
 * User API Module (OPTIMIZED)
 * Uses axios instance for all API calls
 * Error handling managed by axios response interceptor
 */

import { api } from "@/lib/utils";
import { User } from "./types";

/**
 * Fetch user profile data
 * @returns User object or null if token is missing
 * Note: Token is automatically added by axios request interceptor
 */
export const fetchUserData = async (): Promise<User | null> => {
	try {
		const response = await api.get<User>("/anggota/profile");
		return response.data;
	} catch (error) {
		// Error already handled by response interceptor
		return null;
	}
};

/**
 * Update user profile data
 * @param userId - User ID to update
 * @param formData - FormData containing user profile updates
 * @returns true if successful, false otherwise
 */
export const updateUserData = async (
	userId: number,
	formData: FormData
): Promise<boolean> => {
	try {
		await api.put(`/anggota/${userId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return true;
	} catch (error) {
		// Error already handled by response interceptor
		return false;
	}
};
