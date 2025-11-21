"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	PaymentMethod,
	CreatePaymentMethodPayload,
} from "@/lib/payment-method-api";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface PaymentMethodFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	paymentMethod?: PaymentMethod | null;
	onSubmit: (data: CreatePaymentMethodPayload) => Promise<boolean>;
	onUploadIcon?: (file: File) => Promise<string | null>;
}

export function PaymentMethodFormDialog({
	open,
	onOpenChange,
	paymentMethod,
	onSubmit,
	onUploadIcon,
}: PaymentMethodFormDialogProps) {
	const [uploading, setUploading] = useState(false);
	const [iconPreview, setIconPreview] = useState<string>("");
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CreatePaymentMethodPayload>();

	const isActive = watch("is_active");
	const adminFeeType = watch("admin_fee_type");

	useEffect(() => {
		if (paymentMethod) {
			reset({
				name: paymentMethod.name,
				channel: paymentMethod.channel,
				midtrans_code: paymentMethod.midtrans_code || "",
				icon_url: paymentMethod.icon_url || "",
				description: paymentMethod.description || "",
				admin_fee_type: paymentMethod.admin_fee_type,
				admin_fee_value: paymentMethod.admin_fee_value,
				is_active: paymentMethod.is_active,
				sort_order: paymentMethod.sort_order,
			});
			setIconPreview(paymentMethod.icon_url || "");
		} else {
			reset({
				is_active: true,
				admin_fee_type: "fixed",
				admin_fee_value: 0,
				sort_order: 0,
			});
			setIconPreview("");
		}
	}, [paymentMethod, reset]);

	const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !onUploadIcon) return;

		if (file.size > 2 * 1024 * 1024) {
			alert("Ukuran file maksimal 2MB");
			return;
		}

		try {
			setUploading(true);
			const iconUrl = await onUploadIcon(file);
			if (iconUrl) {
				setValue("icon_url", iconUrl);
				setIconPreview(iconUrl);
			}
		} finally {
			setUploading(false);
		}
	};

	const onFormSubmit = async (data: CreatePaymentMethodPayload) => {
		const success = await onSubmit(data);
		if (success) {
			reset();
			setIconPreview("");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{paymentMethod
							? "Edit Metode Pembayaran"
							: "Tambah Metode Pembayaran"}
					</DialogTitle>
					<DialogDescription>
						Kelola metode pembayaran yang tersedia untuk donasi
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
					{/* Icon Upload */}
					<div className="space-y-2">
						<Label>Icon (Opsional)</Label>
						<div className="border-2 border-dashed rounded-lg p-4">
							{iconPreview ? (
								<div className="relative">
									<Image
										src={iconPreview}
										alt="Preview"
										width={100}
										height={100}
										className="w-24 h-24 object-contain rounded"
									/>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute top-0 right-0"
										onClick={() => {
											setIconPreview("");
											setValue("icon_url", "");
										}}
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							) : (
								<div className="text-center">
									<Upload className="mx-auto h-8 w-8 text-muted-foreground" />
									<div className="mt-2">
										<label htmlFor="icon-upload">
											<Button
												type="button"
												variant="outline"
												disabled={uploading}
												onClick={() =>
													document.getElementById("icon-upload")?.click()
												}
											>
												{uploading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Uploading...
													</>
												) : (
													"Upload Icon"
												)}
											</Button>
										</label>
										<input
											id="icon-upload"
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleIconUpload}
										/>
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										PNG, JPG up to 2MB
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">Nama Metode *</Label>
							<Input
								id="name"
								{...register("name", { required: "Nama wajib diisi" })}
								placeholder="Contoh: BCA Virtual Account"
							/>
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Channel */}
						<div className="space-y-2">
							<Label htmlFor="channel">Channel *</Label>
							<Select
								onValueChange={(value) => setValue("channel", value)}
								defaultValue={paymentMethod?.channel}
							>
								<SelectTrigger>
									<SelectValue placeholder="Pilih channel" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="bank_transfer">Bank Transfer</SelectItem>
									<SelectItem value="e_wallet">E-Wallet</SelectItem>
									<SelectItem value="qris">QRIS</SelectItem>
									<SelectItem value="credit_card">Credit Card</SelectItem>
									<SelectItem value="va">Virtual Account</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Midtrans Code */}
					<div className="space-y-2">
						<Label htmlFor="midtrans_code">Kode Midtrans (Opsional)</Label>
						<Input
							id="midtrans_code"
							{...register("midtrans_code")}
							placeholder="Contoh: bca_va, gopay, qris"
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Deskripsi (Opsional)</Label>
						<Textarea
							id="description"
							{...register("description")}
							placeholder="Deskripsi metode pembayaran"
							rows={3}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Admin Fee Type */}
						<div className="space-y-2">
							<Label htmlFor="admin_fee_type">Tipe Biaya Admin *</Label>
							<Select
								onValueChange={(value) =>
									setValue("admin_fee_type", value as "fixed" | "percentage")
								}
								defaultValue={paymentMethod?.admin_fee_type || "fixed"}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="fixed">Tetap (Rp)</SelectItem>
									<SelectItem value="percentage">Persentase (%)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Admin Fee Value */}
						<div className="space-y-2">
							<Label htmlFor="admin_fee_value">
								Nilai Biaya Admin{" "}
								{adminFeeType === "percentage" ? "(%)" : "(Rp)"}
							</Label>
							<Input
								id="admin_fee_value"
								type="number"
								step="0.01"
								{...register("admin_fee_value", { valueAsNumber: true })}
								placeholder="0"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Sort Order */}
						<div className="space-y-2">
							<Label htmlFor="sort_order">Urutan Tampil</Label>
							<Input
								id="sort_order"
								type="number"
								{...register("sort_order", { valueAsNumber: true })}
								placeholder="0"
							/>
						</div>

						{/* Is Active */}
						<div className="space-y-2">
							<Label htmlFor="is_active">Status</Label>
							<div className="flex items-center space-x-2 pt-2">
								<Switch
									id="is_active"
									checked={isActive}
									onCheckedChange={(checked) => setValue("is_active", checked)}
								/>
								<Label htmlFor="is_active" className="cursor-pointer">
									{isActive ? "Aktif" : "Nonaktif"}
								</Label>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Batal
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Menyimpan...
								</>
							) : (
								"Simpan"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
