import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface UserPayload {
	id: string;
	nama: string;
	role: string;
	iat: number;
	exp: number;
}

export function getUserFromToken(): UserPayload | null {
	const token = Cookies.get("token");
	if (!token) {
		return null;
	}

	try {
		const decoded: UserPayload = jwtDecode(token);
		// Periksa apakah token sudah kedaluwarsa
		if (decoded.exp * 1000 < Date.now()) {
			Cookies.remove("token"); // Hapus token yang sudah tidak valid
			return null;
		}
		return decoded;
	} catch (error) {
		console.error("Gagal mendekode token:", error);
		Cookies.remove("token"); // Hapus token yang rusak
		return null;
	}
}
