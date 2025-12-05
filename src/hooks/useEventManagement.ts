/**
 * CUSTOM HOOK: Event Management
 * Mengelola state dan operations untuk admin event management
 */

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventFilters, CreateEventForm } from "@/types/event";
import { eventAPI } from "@/lib/api/event";
import { toast } from "sonner";

export function useEventManagement() {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState<EventFilters>({
		page: 1,
		limit: 50,
		status: undefined,
		location_type: undefined,
		search: undefined,
	});

	// Fetch all events with filters
	const {
		data: eventsData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-events", filters],
		queryFn: () => eventAPI.getAll(filters),
		staleTime: 30000, // 30 seconds
	});

	// Fetch event statistics
	const { data: statsData } = useQuery({
		queryKey: ["event-stats"],
		queryFn: async () => {
			const response = await eventAPI.getAll({ page: 1, limit: 1000 });
			const events = response.data;

			return {
				total: events.length,
				published: events.filter((e) => e.status === "published").length,
				draft: events.filter((e) => e.status === "draft").length,
				ended: events.filter((e) => e.status === "ended").length,
				cancelled: events.filter((e) => e.status === "cancelled").length,
				totalParticipants: events.reduce(
					(sum, e) => sum + (e.confirmedParticipants || 0),
					0
				),
				upcomingEvents: events.filter(
					(e) =>
						e.status === "published" &&
						new Date(e.start_date) > new Date()
				).length,
			};
		},
		staleTime: 60000, // 1 minute
	});

	// Create event mutation
	const createEventMutation = useMutation({
		mutationFn: (data: CreateEventForm) => eventAPI.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-events"] });
			queryClient.invalidateQueries({ queryKey: ["event-stats"] });
			toast.success("Event berhasil dibuat");
		},
		onError: (error: Error) => {
			toast.error(`Gagal membuat event: ${error.message}`);
		},
	});

	// Update event mutation
	const updateEventMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<CreateEventForm> }) =>
			eventAPI.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-events"] });
			queryClient.invalidateQueries({ queryKey: ["event-stats"] });
			toast.success("Event berhasil diupdate");
		},
		onError: (error: Error) => {
			toast.error(`Gagal update event: ${error.message}`);
		},
	});

	// Delete event mutation
	const deleteEventMutation = useMutation({
		mutationFn: (id: number) => eventAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-events"] });
			queryClient.invalidateQueries({ queryKey: ["event-stats"] });
			toast.success("Event berhasil dihapus");
		},
		onError: (error: Error) => {
			toast.error(`Gagal hapus event: ${error.message}`);
		},
	});

	// Publish event
	const publishEvent = useCallback(
		async (id: number) => {
			try {
				await updateEventMutation.mutateAsync({ id, data: { status: "published" } });
				toast.success("Event berhasil dipublikasikan");
			} catch (error) {
				toast.error("Gagal publish event");
			}
		},
		[updateEventMutation]
	);

	// Update filters
	const updateFilters = useCallback((newFilters: Partial<EventFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// Export to CSV
	const exportToCSV = useCallback(() => {
		if (!eventsData?.data) return;

		const csvData = eventsData.data.map((event) => ({
			ID: event.id,
			Judul: event.title,
			Status: event.status,
			"Tipe Lokasi": event.location_type,
			Harga: event.price,
			"Max Peserta": event.max_participants,
			"Peserta Terdaftar": event.confirmedParticipants || 0,
			"Tanggal Mulai": new Date(event.start_date).toLocaleDateString("id-ID"),
			"Tanggal Selesai": new Date(event.end_date).toLocaleDateString("id-ID"),
		}));

		const headers = Object.keys(csvData[0]).join(",");
		const rows = csvData.map((row) => Object.values(row).join(","));
		const csv = [headers, ...rows].join("\n");

		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `events-${new Date().toISOString()}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);

		toast.success("Data event berhasil di-export");
	}, [eventsData]);

	return {
		// Data
		events: eventsData?.data || [],
		stats: statsData,
		pagination: {
			page: eventsData?.pagination?.currentPage || 1,
			totalPages: eventsData?.pagination?.totalPages || 1,
			totalItems: eventsData?.pagination?.totalItems || 0,
		},
		filters,

		// States
		isLoading,
		error,

		// Actions
		createEvent: createEventMutation.mutate,
		updateEvent: updateEventMutation.mutate,
		deleteEvent: deleteEventMutation.mutate,
		publishEvent,
		updateFilters,
		refetch,
		exportToCSV,

		// Mutation states
		isCreating: createEventMutation.isPending,
		isUpdating: updateEventMutation.isPending,
		isDeleting: deleteEventMutation.isPending,
	};
}
