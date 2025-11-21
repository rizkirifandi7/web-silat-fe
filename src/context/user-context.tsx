"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
	useRef,
} from "react";
import Cookies from "js-cookie";
import { User } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/auth-api";

interface UserContextType {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	login: (token: string, user: User) => void;
	logout: () => void;
	refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	// Use refs to avoid dependency changes
	const routerRef = useRef(router);
	const pathnameRef = useRef(pathname);

	// Update refs when they change
	useEffect(() => {
		routerRef.current = router;
		pathnameRef.current = pathname;
	}, [router, pathname]);

	const fetchUser = useCallback(async () => {
		const token = Cookies.get("token");
		if (!token) {
			setIsLoading(false);
			setUser(null);
			return;
		}

		setIsLoading(true);
		try {
			const data = await getUserProfile(token);
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

			// Use ref to avoid dependency
			const currentPathname = pathnameRef.current;
			if (
				!["/login", "/verify", "/"].includes(currentPathname) &&
				!currentPathname.startsWith("/verify/")
			) {
				routerRef.current.replace("/login");
			}
		} finally {
			setIsLoading(false);
		}
	}, []); // Empty dependencies - stable function

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
		routerRef.current.replace("/login");
	};

	// Expose refetch function for manual refresh
	const refetchUser = useCallback(async () => {
		await fetchUser();
	}, [fetchUser]);

	return (
		<UserContext.Provider
			value={{ user, isLoading, error, login, logout, refetchUser }}
		>
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
