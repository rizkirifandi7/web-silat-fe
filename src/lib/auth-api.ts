import { User } from "@/types/user";

interface LoginResponse {
	data: {
		token: string;
		user: User;
	};
	message?: string;
}

interface ApiError {
	message: string;
	statusCode?: number;
}

/**
 * Login user with email and password
 * @param email - User email address
 * @param password - User password
 * @returns Login response with token and user data
 * @throws Error with message if login fails
 */
export async function loginUser(
	email: string,
	password: string
): Promise<LoginResponse> {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (!apiUrl) {
		throw new Error(
			"API URL tidak dikonfigurasi. Hubungi administrator sistem."
		);
	}

	try {
		const response = await fetch(`${apiUrl}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const result = await response.json();

		if (!response.ok) {
			const errorMessage = result.message || getErrorMessage(response.status);
			const error: ApiError = {
				message: errorMessage,
				statusCode: response.status,
			};
			throw error;
		}

		// Validate response structure
		if (!result.data || !result.data.token || !result.data.user) {
			throw new Error("Format respons server tidak valid.");
		}

		return result as LoginResponse;
	} catch (error) {
		// Handle network errors
		if (error instanceof TypeError) {
			throw new Error(
				"Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
			);
		}

		// Re-throw API errors
		if (error && typeof error === "object" && "message" in error) {
			throw error;
		}

		// Unknown errors
		throw new Error("Terjadi kesalahan yang tidak diketahui saat login.");
	}
}

/**
 * Get user profile from server
 * @param token - JWT authentication token
 * @returns User profile data
 * @throws Error if token is invalid or expired
 */
export async function getUserProfile(token: string): Promise<User> {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (!apiUrl) {
		throw new Error("API URL tidak dikonfigurasi.");
	}

	try {
		const response = await fetch(`${apiUrl}/anggota/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
			}
			throw new Error("Gagal mengambil profil pengguna.");
		}

		const data = await response.json();
		return data as User;
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error("Tidak dapat terhubung ke server.");
		}

		if (error && typeof error === "object" && "message" in error) {
			throw error;
		}

		throw new Error("Terjadi kesalahan saat mengambil profil.");
	}
}

/**
 * Get appropriate error message based on HTTP status code
 * @param statusCode - HTTP status code
 * @returns User-friendly error message
 */
function getErrorMessage(statusCode: number): string {
	switch (statusCode) {
		case 400:
			return "Email atau password tidak boleh kosong.";
		case 401:
			return "Email atau password salah.";
		case 403:
			return "Akses ditolak. Hubungi administrator.";
		case 404:
			return "Layanan login tidak ditemukan.";
		case 429:
			return "Terlalu banyak percobaan login. Silakan coba lagi nanti.";
		case 500:
			return "Server mengalami masalah. Coba lagi nanti.";
		case 503:
			return "Layanan sedang dalam pemeliharaan.";
		default:
			return "Terjadi kesalahan saat login.";
	}
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
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
	message?: string;
} {
	if (password.length < 6) {
		return {
			isValid: false,
			message: "Password minimal 6 karakter.",
		};
	}

	if (password.length > 100) {
		return {
			isValid: false,
			message: "Password maksimal 100 karakter.",
		};
	}

	return { isValid: true };
}
