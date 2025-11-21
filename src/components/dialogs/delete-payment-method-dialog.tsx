"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PaymentMethod } from "@/lib/payment-method-api";

interface DeletePaymentMethodDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	paymentMethod: PaymentMethod | null;
	onConfirm: () => Promise<boolean>;
}

export function DeletePaymentMethodDialog({
	open,
	onOpenChange,
	paymentMethod,
	onConfirm,
}: DeletePaymentMethodDialogProps) {
	const handleConfirm = async () => {
		const success = await onConfirm();
		if (success) {
			onOpenChange(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hapus Metode Pembayaran</AlertDialogTitle>
					<AlertDialogDescription>
						Apakah Anda yakin ingin menghapus metode pembayaran{" "}
						<span className="font-semibold">{paymentMethod?.name}</span>?
						Tindakan ini tidak dapat dibatalkan.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Hapus</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
