import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { User } from "@/types/user";

/**
 * Hook untuk melindungi rute berdasarkan peran pengguna.
 * @param allowedRoles - Array peran yang diizinkan untuk mengakses rute.
 */
export const useAuthGuard = (allowedRoles: Array<User["role"]>) => {
	const router = useRouter();
	const { user, isLoading } = useUserContext();

	useEffect(() => {
		// Jika masih loading, jangan lakukan apa-apa.
		if (isLoading) {
			return;
		}

		// Jika tidak ada pengguna atau peran tidak diizinkan, tendang ke login.
		if (!user || !allowedRoles.includes(user.role)) {
			router.replace("/login");
		}
	}, [user, isLoading, allowedRoles, router]);

	// Kembalikan status loading dan user untuk menampilkan UI yang sesuai
	const isAccessing = isLoading || !user || !allowedRoles.includes(user.role);

	return { isAccessing, user };
};
