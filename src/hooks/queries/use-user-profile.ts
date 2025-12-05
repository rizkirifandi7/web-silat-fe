/**
 * React Query Hook for User Profile Management
 * Handles profile fetching, updating, and password changes
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import type { User } from "@/lib/types";

/**
 * Fetch user profile
 */
export function useUserProfile() {
	return useQuery({
		queryKey: ["user", "profile"],
		queryFn: async () => {
			const response = await api.get<User>("/anggota/profile");
			return response.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { id: number; formData: FormData }) => {
			const response = await api.put(`/anggota/${data.id}`, data.formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
			toast.success("Profile updated successfully");
		},
		onError: (error) => {
			// Error already handled by response interceptor
		},
	});
}

/**
 * Change password
 */
export function useChangePassword() {
	return useMutation({
		mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
			const response = await api.post("/auth/change-password", data);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Password changed successfully");
		},
		onError: (error) => {
		},
	});
}
