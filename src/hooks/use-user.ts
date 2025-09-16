"use client";

import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";

interface UserPayload {
	id: string;
	nama: string;
	role: string;
}

export function useUser() {
	const [user, setUser] = useState<UserPayload | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fungsi ini hanya akan berjalan di sisi klien setelah hidrasi
		const userData = getUserFromToken();
		setUser(userData);
		setIsLoading(false);
	}, []);

	return { user, isLoading };
}
