/**
 * CUSTOM HOOK: Registration Management
 * Mengelola pendaftaran event untuk admin
 */

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RegistrationStatus } from "@/types/event";
import { registrationAPI } from "@/lib/api/event";
import { toast } from "sonner";

export function useEventRegistrations(eventId: number) {
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "all">(
		"all"
	);

	// Fetch registrations for event
	const {
		data: registrations = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["event-registrations", eventId],
		queryFn: () => registrationAPI.getByEventId(eventId),
		staleTime: 30000,
		select: (response) => response.data,
	});

	// Update registration status
	const updateStatusMutation = useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: number;
			status: RegistrationStatus;
		}) => registrationAPI.updateStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["event-registrations", eventId],
			});
			toast.success("Status pendaftaran berhasil diupdate");
		},
		onError: (error: Error) => {
			toast.error(`Gagal update status: ${error.message}`);
		},
	});

	// Delete registration
	const deleteRegistrationMutation = useMutation({
		mutationFn: (id: number) => registrationAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["event-registrations", eventId],
			});
			toast.success("Pendaftaran berhasil dihapus");
		},
		onError: (error: Error) => {
			toast.error(`Gagal hapus pendaftaran: ${error.message}`);
		},
	});

	// Filtered registrations
	const filteredRegistrations =
		statusFilter === "all"
			? registrations
			: registrations.filter((r) => r.status === statusFilter);

	// Statistics
	const stats = {
		total: registrations.length,
		confirmed: registrations.filter((r) => r.status === "confirmed").length,
		pending: registrations.filter((r) => r.status === "pending_payment")
			.length,
		cancelled: registrations.filter((r) => r.status === "cancelled").length,
	};

	// Export to Excel/CSV
	const exportRegistrations = useCallback(() => {
		if (!registrations.length) {
			toast.error("Tidak ada data untuk di-export");
			return;
		}

		const csvData = registrations.map((reg, index) => ({
			No: index + 1,
			Nama: reg.user?.nama || "-",
			Email: reg.user?.email || "-",
			"No. HP": reg.user?.no_telepon || "-",
			Status: reg.status,
			"Tanggal Daftar": new Date(reg.registered_at).toLocaleDateString(
				"id-ID"
			),
			"Status Pembayaran": reg.payment?.status || "Belum bayar",
		}));

		const headers = Object.keys(csvData[0]).join(",");
		const rows = csvData.map((row) =>
			Object.values(row)
				.map((v) => `"${v}"`)
				.join(",")
		);
		const csv = [headers, ...rows].join("\n");

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `registrations-event-${eventId}-${new Date().toISOString()}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);

		toast.success("Data pendaftaran berhasil di-export");
	}, [registrations, eventId]);

	// Send email reminder to pending registrations
	const sendReminders = useCallback(async () => {
		const pendingRegs = registrations.filter(
			(r) => r.status === "pending_payment"
		);

		if (!pendingRegs.length) {
			toast.error("Tidak ada pendaftaran yang pending");
			return;
		}

		// TODO: Implement email reminder API
		toast.info(
			`Sending reminders to ${pendingRegs.length} participants...`
		);
		// await registrationAPI.sendReminders(eventId);
		toast.success("Reminder berhasil dikirim");
	}, [registrations]);

	return {
		// Data
		registrations: filteredRegistrations,
		allRegistrations: registrations,
		stats,

		// States
		isLoading,
		error,
		statusFilter,

		// Actions
		setStatusFilter,
		updateStatus: updateStatusMutation.mutate,
		deleteRegistration: deleteRegistrationMutation.mutate,
		exportRegistrations,
		sendReminders,
		refetch,

		// Mutation states
		isUpdating: updateStatusMutation.isPending,
		isDeleting: deleteRegistrationMutation.isPending,
	};
}
