"use client";

import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";
import Cookies from "js-cookie";

interface UserProfile {
	id: number;
	nama: string;
	email: string;
	foto: string;
	role: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	alamat: string;
	agama: string;
	jenis_kelamin: string;
	no_telepon: string;
	angkatan_unit: string;
	status_keanggotaan: string;
	tingkatan_sabuk: string;
	status_perguruan: string;
}

export function useUser() {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserProfile = async () => {
			const tokenUser = getUserFromToken();
			if (!tokenUser) {
				setIsLoading(false);
				return;
			}

			try {
				const token = Cookies.get("token");
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/anggota/profile`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.ok) {
					const profileData = await response.json();
					console.log("User profile data:", profileData);
					setUser(profileData);
				} else {
					// Fallback to token data if profile fetch fails
					setUser({
						id: parseInt(tokenUser.id),
						nama: tokenUser.nama,
						role: tokenUser.role,
						email: "",
						foto: "",
						tempat_lahir: "",
						tanggal_lahir: "",
						alamat: "",
						agama: "",
						jenis_kelamin: "",
						no_telepon: "",
						angkatan_unit: "",
						status_keanggotaan: "",
						tingkatan_sabuk: "",
						status_perguruan: "",
					});
				}
			} catch (error) {
				console.error("Error fetching user profile:", error);
				// Fallback to token data
				setUser({
					id: parseInt(tokenUser.id),
					nama: tokenUser.nama,
					role: tokenUser.role,
					email: "",
					foto: "",
					tempat_lahir: "",
					tanggal_lahir: "",
					alamat: "",
					agama: "",
					jenis_kelamin: "",
					no_telepon: "",
					angkatan_unit: "",
					status_keanggotaan: "",
					tingkatan_sabuk: "",
					status_perguruan: "",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	return { user, isLoading };
}
