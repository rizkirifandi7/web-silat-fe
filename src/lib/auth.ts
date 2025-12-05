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
	const token = Cookies.get("accessToken");
	if (!token) {
		return null;
	}

	try {
		const decoded: UserPayload = jwtDecode(token);
		// Periksa apakah token sudah kedaluwarsa
		if (decoded.exp * 1000 < Date.now()) {
			Cookies.remove("accessToken"); // Hapus token yang sudah tidak valid
			return null;
		}
		return decoded;
	} catch (error) {
		Cookies.remove("accessToken"); // Hapus token yang rusak
		return null;
	}
}
