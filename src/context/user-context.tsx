"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import Cookies from "js-cookie";
import { User } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";

interface UserContextType {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	login: (token: string, user: User) => void;
	logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	const fetchUser = useCallback(async () => {
		const token = Cookies.get("token");
		if (!token) {
			setIsLoading(false);
			setUser(null);
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/anggota/profile`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Sesi tidak valid atau telah berakhir.");
			}

			const data = await response.json();
			setUser(data);
			setError(null);
		} catch (err: unknown) {
			console.error("Gagal mengambil data pengguna:", err);
			setUser(null);
			Cookies.remove("token");
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Terjadi kesalahan yang tidak diketahui.");
			}
			if (!["/login", "/verify"].includes(pathname)) {
				router.replace("/login");
			}
		} finally {
			setIsLoading(false);
		}
	}, [pathname, router]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const login = (token: string, userData: User) => {
		Cookies.set("token", token, { expires: 7, path: "/" });
		setUser(userData);
		setError(null);

		if (userData.role === "admin" || userData.role === "superadmin") {
			router.replace("/dashboard/beranda");
		} else if (userData.role === "anggota") {
			router.replace("/dashboard-anggota/beranda");
		} else {
			router.replace("/");
		}
	};

	const logout = () => {
		Cookies.remove("token");
		setUser(null);
		setError(null);
		router.replace("/login");
	};

	return (
		<UserContext.Provider value={{ user, isLoading, error, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUserContext harus digunakan di dalam UserProvider");
	}
	return context;
};
