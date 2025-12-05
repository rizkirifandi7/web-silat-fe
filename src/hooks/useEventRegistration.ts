/**
 * Custom Hook: useEventRegistration
 * Mengelola logic registrasi event dengan optimistic updates
 */

import { useState, useCallback } from "react";
import { registrationAPI } from "@/lib/api/event";
import { toast } from "sonner";

interface UseEventRegistrationOptions {
	eventId: number;
	userId?: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

interface UseEventRegistrationReturn {
	isRegistered: boolean;
	isChecking: boolean;
	isRegistering: boolean;
	checkRegistration: () => Promise<boolean>;
	register: () => Promise<{ success: boolean; registrationId?: number }>;
	setIsRegistered: (value: boolean) => void;
}

export function useEventRegistration({
	eventId,
	userId,
	onSuccess,
	onError,
}: UseEventRegistrationOptions): UseEventRegistrationReturn {
	const [isRegistered, setIsRegistered] = useState(false);
	const [isChecking, setIsChecking] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);

	const checkRegistration = useCallback(async (): Promise<boolean> => {
		if (!userId) return false;

		try {
			setIsChecking(true);
			
			// Check if user has token before calling API
			const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
			if (!token) {
				// User not logged in, no need to check registration
				setIsRegistered(false);
				return false;
			}
			
		const response = await registrationAPI.checkRegistration(eventId);
		const registered = response.isRegistered || false;
		setIsRegistered(registered);
		return registered;
		} catch (error) {
			// Silent fail for auth errors - user simply not logged in
			const errorMessage = error instanceof Error ? error.message : '';
			if (!errorMessage.toLowerCase().includes('authentication') && 
				!errorMessage.includes('token') && 
				!errorMessage.includes('401')) {
				// Only log unexpected errors
				console.warn("Registration check failed:", error);
			}
			setIsRegistered(false);
			return false;
		} finally {
			setIsChecking(false);
		}
	}, [eventId, userId]);

	const register = useCallback(async () => {
		if (!userId) {
			const error = new Error("User not authenticated");
			if (onError) onError(error);
			return { success: false };
		}

		try {
			setIsRegistering(true);

			const response = await registrationAPI.register({
				event_id: eventId,
				user_id: userId,
			});

			// Optimistic update
			setIsRegistered(true);

			if (onSuccess) {
				onSuccess();
			}

			return { success: true, registrationId: response.data.id };
		} catch (error) {
			const err = error instanceof Error ? error : new Error("Registration failed");
			
			if (onError) {
				onError(err);
			} else {
				toast.error("Gagal mendaftar", {
					description: err.message,
				});
			}

			return { success: false };
		} finally {
			setIsRegistering(false);
		}
	}, [eventId, userId, onSuccess, onError]);

	return {
		isRegistered,
		isChecking,
		isRegistering,
		checkRegistration,
		register,
		setIsRegistered,
	};
}
