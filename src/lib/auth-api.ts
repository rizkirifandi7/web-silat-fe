/**
 * Authentication API Module (OPTIMIZED)
 * Uses axios instance for all API calls
 * Error handling managed by axios response interceptor
 */

import { api } from "@/lib/utils";
import { User } from "@/types/user";

interface LoginResponse {
	data: {
		accessToken: string;
		user: User;
	};
	message?: string;
}

/**
 * Login user with email and password
 * @param email - User email address
 * @param password - User password
 * @returns Login response with accessToken and user data
 */
export async function loginUser(
	email: string,
	password: string
): Promise<LoginResponse> {
	const response = await api.post<LoginResponse>("/auth/login", {
		email,
		password,
	});

	// Validate response structure
	if (!response.data.data?.accessToken || !response.data.data?.user) {
		throw new Error("Format respons server tidak valid.");
	}

	return response.data;
}

interface UserProfileResponse {
	status: string;
	message: string;
	data: User;
}

/**
 * Get user profile from server
 * @returns User profile data
 * Note: Token is automatically added by axios request interceptor
 */
export async function getUserProfile(): Promise<User> {
	const response = await api.get<UserProfileResponse>("/auth/profile");
	return response.data.data;
}

/**
 * Change user password
 * @param oldPassword - Current password
 * @param newPassword - New password
 */
export async function changePassword(
	oldPassword: string,
	newPassword: string
): Promise<void> {
	await api.post("/auth/change-password", {
		oldPassword,
		newPassword,
	});
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
	await api.post("/auth/logout");
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): {
	isValid: boolean;
	message: string;
} {
	if (password.length < 8) {
		return {
			isValid: false,
			message: "Password harus minimal 8 karakter.",
		};
	}

	return {
		isValid: true,
		message: "Password valid.",
	};
}
