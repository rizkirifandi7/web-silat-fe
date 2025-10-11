import Cookies from "js-cookie";
import { User } from "./types";

export const fetchUserData = async (): Promise<User | null> => {
	const token = Cookies.get("token");
	if (!token) return null;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/anggota/profile`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch user data");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		return null;
	}
};

export const updateUserData = async (
	userId: number,
	formData: FormData
): Promise<boolean> => {
	const token = Cookies.get("token");
	if (!token) return false;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/anggota/${userId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			}
		);

		return response.ok;
	} catch (error) {
		console.error("Error updating profile:", error);
		return false;
	}
};
