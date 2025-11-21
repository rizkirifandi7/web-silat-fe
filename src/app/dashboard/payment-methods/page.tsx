"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { usePaymentMethodCrud } from "@/hooks/use-payment-method-crud";
import { DataTablePaymentMethod } from "@/components/data-table/data-table-payment-method";
import { PaymentMethodFormDialog } from "@/components/dialogs/payment-method-form-dialog";
import { DeletePaymentMethodDialog } from "@/components/dialogs/delete-payment-method-dialog";
import {
	PaymentMethod,
	CreatePaymentMethodPayload,
} from "@/lib/payment-method-api";

export default function PaymentMethodsPage() {
	const {
		paymentMethods,
		loading,
		selectedPaymentMethod,
		setSelectedPaymentMethod,
		isDialogOpen,
		setIsDialogOpen,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleUploadIcon,
	} = usePaymentMethodCrud();

	const handleEdit = (paymentMethod: PaymentMethod) => {
		setSelectedPaymentMethod(paymentMethod);
		setIsDialogOpen(true);
	};

	const handleDeleteClick = (paymentMethod: PaymentMethod) => {
		setSelectedPaymentMethod(paymentMethod);
		setIsDeleteDialogOpen(true);
	};

	const handleFormSubmit = async (data: CreatePaymentMethodPayload) => {
		if (selectedPaymentMethod) {
			return await handleUpdate(selectedPaymentMethod.id, data);
		}
		return await handleCreate(data);
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Metode Pembayaran</h1>
					<p className="text-muted-foreground">
						Kelola metode pembayaran untuk donasi
					</p>
				</div>
				<Button
					onClick={() => {
						setSelectedPaymentMethod(null);
						setIsDialogOpen(true);
					}}
				>
					<Plus className="w-4 h-4 mr-2" />
					Tambah Metode
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Daftar Metode Pembayaran</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTablePaymentMethod
						data={paymentMethods}
						loading={loading}
						onEdit={handleEdit}
						onDelete={handleDeleteClick}
					/>
				</CardContent>
			</Card>

			<PaymentMethodFormDialog
				open={isDialogOpen}
				onOpenChange={(open) => {
					setIsDialogOpen(open);
					if (!open) setSelectedPaymentMethod(null);
				}}
				paymentMethod={selectedPaymentMethod}
				onSubmit={handleFormSubmit}
				onUploadIcon={handleUploadIcon}
			/>

			<DeletePaymentMethodDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				paymentMethod={selectedPaymentMethod}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
