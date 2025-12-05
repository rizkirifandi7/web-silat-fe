/**
 * Payment Method CRUD Hook (REFACTORED)
 * Uses React Query hooks for state management
 * Replaces manual useState/useEffect with caching
 */

"use client";

import { useState } from "react";
import {
	usePaymentMethods,
	useCreatePaymentMethod,
	useUpdatePaymentMethod,
	useDeletePaymentMethod,
	useUploadPaymentMethodIcon,
	type PaymentMethod,
	type CreatePaymentMethodPayload,
	type UpdatePaymentMethodPayload,
} from "@/hooks/queries/use-payment-methods";

export function usePaymentMethodCrud() {
	// Dialog states (UI state only)
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	
	// Filter states
	const [channel, setChannel] = useState<string | undefined>(undefined);
	const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

	// React Query hooks (replaces manual useState + useEffect)
	const { data: paymentMethods = [], isLoading: loading, refetch } = usePaymentMethods({
		channel,
		is_active: isActive,
	});

	const createMutation = useCreatePaymentMethod();
	const updateMutation = useUpdatePaymentMethod();
	const deleteMutation = useDeletePaymentMethod();
	const uploadIconMutation = useUploadPaymentMethodIcon();

	// Fetch payment methods (now just triggers refetch with new filters)
	const fetchPaymentMethods = async (params?: {
		channel?: string;
		is_active?: boolean;
	}) => {
		if (params?.channel !== undefined) setChannel(params.channel);
		if (params?.is_active !== undefined) setIsActive(params.is_active);
		await refetch();
	};

	// Create payment method
	const handleCreate = async (data: CreatePaymentMethodPayload): Promise<boolean> => {
		try {
			await createMutation.mutateAsync(data);
			setIsDialogOpen(false);
			return true;
		} catch (error) {
			return false;
		}
	};

	// Update payment method
	const handleUpdate = async (
		id: number,
		data: UpdatePaymentMethodPayload
	): Promise<boolean> => {
		try {
			await updateMutation.mutateAsync({ id, data });
			setIsDialogOpen(false);
			setSelectedPaymentMethod(null);
			return true;
		} catch (error) {
			return false;
		}
	};

	// Delete payment method
	const handleDelete = async (): Promise<boolean> => {
		if (!selectedPaymentMethod) return false;

		try {
			await deleteMutation.mutateAsync(selectedPaymentMethod.id);
			setIsDeleteDialogOpen(false);
			setSelectedPaymentMethod(null);
			return true;
		} catch (error) {
			return false;
		}
	};

	// Upload icon
	const handleUploadIcon = async (file: File): Promise<string | null> => {
		try {
			const iconUrl = await uploadIconMutation.mutateAsync(file);
			return iconUrl;
		} catch (error) {
			return null;
		}
	};

	// Open create dialog
	const openCreateDialog = () => {
		setSelectedPaymentMethod(null);
		setIsDialogOpen(true);
	};

	// Open edit dialog
	const openEditDialog = (paymentMethod: PaymentMethod) => {
		setSelectedPaymentMethod(paymentMethod);
		setIsDialogOpen(true);
	};

	// Open delete dialog
	const openDeleteDialog = (paymentMethod: PaymentMethod) => {
		setSelectedPaymentMethod(paymentMethod);
		setIsDeleteDialogOpen(true);
	};

	return {
		// Data (from React Query)
		paymentMethods,
		loading,
		
		// UI state
		selectedPaymentMethod,
		setSelectedPaymentMethod,
		isDialogOpen,
		isDeleteDialogOpen,
		setIsDialogOpen,
		setIsDeleteDialogOpen,
		
		// Actions
		fetchPaymentMethods,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleUploadIcon,
		openCreateDialog,
		openEditDialog,
		openDeleteDialog,
	};
}
