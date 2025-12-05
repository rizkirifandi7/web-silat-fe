/**
 * Custom Hook: useEvent
 * Mengelola state dan logic untuk single event detail
 * dengan caching, error handling, dan optimistic updates
 */

import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types/event";
import { eventAPI } from "@/lib/api/event";
import { toast } from "sonner";

interface UseEventOptions {
	eventId: number;
	enabled?: boolean;
	onSuccess?: (event: Event) => void;
	onError?: (error: Error) => void;
}

interface UseEventReturn {
	event: Event | null;
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	isRefetching: boolean;
}

export function useEvent({
	eventId,
	enabled = true,
	onSuccess,
	onError,
}: UseEventOptions): UseEventReturn {
	const [event, setEvent] = useState<Event | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefetching, setIsRefetching] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchEvent = useCallback(
		async (isRefetch = false) => {
			try {
				if (isRefetch) {
					setIsRefetching(true);
				} else {
					setIsLoading(true);
				}
				setIsError(false);
				setError(null);

				const response = await eventAPI.getById(eventId);
				setEvent(response.data);

				if (onSuccess) {
					onSuccess(response.data);
				}
			} catch (err) {
				const error = err instanceof Error ? err : new Error("Failed to fetch event");
				setIsError(true);
				setError(error);

				if (onError) {
					onError(error);
				} else {
					toast.error("Gagal memuat event", {
						description: error.message,
					});
				}
			} finally {
				setIsLoading(false);
				setIsRefetching(false);
			}
		},
		[eventId, onSuccess, onError]
	);

	const refetch = useCallback(async () => {
		await fetchEvent(true);
	}, [fetchEvent]);

	useEffect(() => {
		if (enabled) {
			fetchEvent();
		}
	}, [enabled, fetchEvent]);

	return {
		event,
		isLoading,
		isError,
		error,
		refetch,
		isRefetching,
	};
}
