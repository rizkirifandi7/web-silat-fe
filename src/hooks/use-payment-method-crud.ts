"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
	getAllPaymentMethods,
	createPaymentMethod,
	updatePaymentMethod,
	deletePaymentMethod,
	type PaymentMethod,
	type CreatePaymentMethodPayload,
	type UpdatePaymentMethodPayload,
} from "@/lib/payment-method-api";
import { api } from "@/lib/utils";

export function usePaymentMethodCrud() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// Fetch payment methods
	const fetchPaymentMethods = async (params?: {
		channel?: string;
		is_active?: boolean;
	}) => {
		try {
			setLoading(true);
			const response = await getAllPaymentMethods(params);

			if (response.status === "success") {
				console.log("Fetched payment methods:", response.data);
				setPaymentMethods(response.data);
			}
		} catch (error) {
			console.error("Error fetching payment methods:", error);
			toast.error("Gagal memuat data metode pembayaran");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPaymentMethods();
	}, []);

	// Create payment method
	const handleCreate = async (data: CreatePaymentMethodPayload) => {
		try {
			console.log("Creating payment method with data:", data);
			const response = await createPaymentMethod(data);
			console.log("Create payment method response:", response);
			if (response.status === "success") {
				toast.success("Metode pembayaran berhasil dibuat");
				fetchPaymentMethods();
				setIsDialogOpen(false);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error creating payment method:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Gagal membuat metode pembayaran";
			toast.error(errorMessage);
			return false;
		}
	};

	// Update payment method
	const handleUpdate = async (
		id: number,
		data: UpdatePaymentMethodPayload
	) => {
		try {
			const response = await updatePaymentMethod(id, data);
			if (response.status === "success") {
				toast.success("Metode pembayaran berhasil diupdate");
				fetchPaymentMethods();
				setIsDialogOpen(false);
				setSelectedPaymentMethod(null);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error updating payment method:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Gagal mengupdate metode pembayaran";
			toast.error(errorMessage);
			return false;
		}
	};

	// Delete payment method
	const handleDelete = async (): Promise<boolean> => {
		if (!selectedPaymentMethod) return false;

		try {
			const response = await deletePaymentMethod(selectedPaymentMethod.id);
			if (response.status === "success") {
				toast.success("Metode pembayaran berhasil dihapus");
				fetchPaymentMethods();
				setIsDeleteDialogOpen(false);
				setSelectedPaymentMethod(null);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error deleting payment method:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Gagal menghapus metode pembayaran";
			toast.error(errorMessage);
			return false;
		}
	};

	// Upload icon
	const handleUploadIcon = async (file: File): Promise<string | null> => {
		try {
			const formData = new FormData();
			formData.append("icon", file);

			const response = await api.post("/donasi/payment-methods/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			
			if (response.data.status === "success") {
				toast.success("Icon berhasil diupload");
				return response.data.data.icon_url;
			}
			return null;
		} catch (error) {
			console.error("Error uploading icon:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Gagal mengupload icon";
			toast.error(errorMessage);
			return null;
		}
	};

	return {
		paymentMethods,
		loading,
		selectedPaymentMethod,
		setSelectedPaymentMethod,
		isDialogOpen,
		setIsDialogOpen,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		fetchPaymentMethods,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleUploadIcon,
	};
}
