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
import { Campaign, CreateCampaignPayload } from "@/lib/campaign-api";
import { Loader2, Upload, X, Plus } from "lucide-react";
import Image from "next/image";

interface CampaignFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaign?: Campaign | null;
	onSubmit: (data: CreateCampaignPayload) => Promise<boolean>;
	onUploadImage: (file: File) => Promise<string | null>;
}

export function CampaignFormDialog({
	open,
	onOpenChange,
	campaign,
	onSubmit,
	onUploadImage,
}: CampaignFormDialogProps) {
	const [uploading, setUploading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [benefits, setBenefits] = useState<string[]>([""]);
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CreateCampaignPayload>();

	const isPublished = watch("is_published");
	const isUrgent = watch("is_urgent");

	useEffect(() => {
		if (campaign) {
			reset({
				title: campaign.title,
				category: campaign.category,
				description: campaign.description,
				story: campaign.story,
				image_url: campaign.image_url || "",
				target_amount: campaign.target_amount,
				urgency_level: campaign.urgency_level,
				is_published: campaign.is_published,
				is_urgent: campaign.is_urgent,
				start_date: campaign.start_date?.split("T")[0],
				end_date: campaign.end_date?.split("T")[0],
			});
			setImagePreview(campaign.image_url || "");
			if (campaign.benefits && campaign.benefits.length > 0) {
				setBenefits(campaign.benefits.map((b) => b.benefit_text));
			}
		} else {
			reset({
				is_published: false,
				is_urgent: false,
				urgency_level: "medium",
				category: "sosial",
			});
			setImagePreview("");
			setBenefits([""]);
		}
	}, [campaign, reset]);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			alert("File harus berupa gambar");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("Ukuran file maksimal 5MB");
			return;
		}

		try {
			setUploading(true);
			const imageUrl = await onUploadImage(file);
			if (imageUrl) {
				setValue("image_url", imageUrl);
				setImagePreview(imageUrl);
			}
		} finally {
			setUploading(false);
		}
	};

	const handleAddBenefit = () => {
		setBenefits([...benefits, ""]);
	};

	const handleRemoveBenefit = (index: number) => {
		setBenefits(benefits.filter((_, i) => i !== index));
	};

	const handleBenefitChange = (index: number, value: string) => {
		const newBenefits = [...benefits];
		newBenefits[index] = value;
		setBenefits(newBenefits);
	};

	const onFormSubmit = async (data: CreateCampaignPayload) => {
		const benefitsData = benefits
			.filter((b) => b.trim())
			.map((benefit, index) => ({
				benefit_text: benefit,
				sort_order: index,
			}));

		const payload = {
			...data,
			benefits: benefitsData,
		};

		const success = await onSubmit(payload);
		if (success) {
			reset();
			setBenefits([""]);
			setImagePreview("");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{campaign ? "Edit Campaign" : "Tambah Campaign Baru"}
					</DialogTitle>
					<DialogDescription>
						Isi form di bawah untuk {campaign ? "mengupdate" : "membuat"}{" "}
						campaign donasi
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
					{/* Image Upload */}
					<div className="space-y-2">
						<Label>Gambar Campaign *</Label>
						<div className="border-2 border-dashed rounded-lg p-4">
							{imagePreview ? (
								<div className="relative">
									<Image
										src={imagePreview}
										alt="Preview"
										width={400}
										height={200}
										className="w-full h-48 object-cover rounded"
									/>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute top-2 right-2"
										onClick={() => {
											setImagePreview("");
											setValue("image_url", "");
										}}
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							) : (
								<div className="text-center">
									<Upload className="mx-auto h-12 w-12 text-muted-foreground" />
									<div className="mt-2">
										<label htmlFor="image-upload">
											<Button
												type="button"
												variant="outline"
												disabled={uploading}
												onClick={() =>
													document.getElementById("image-upload")?.click()
												}
											>
												{uploading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Uploading...
													</>
												) : (
													"Upload Gambar"
												)}
											</Button>
										</label>
										<input
											id="image-upload"
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageUpload}
										/>
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										PNG, JPG up to 5MB
									</p>
								</div>
							)}
						</div>
						{errors.image_url && (
							<p className="text-sm text-destructive">Gambar wajib diupload</p>
						)}
					</div>

					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title">Judul Campaign *</Label>
						<Input
							id="title"
							{...register("title", { required: "Judul wajib diisi" })}
							placeholder="Contoh: Bantu Pembangunan Gedung Latihan"
						/>
						{errors.title && (
							<p className="text-sm text-destructive">{errors.title.message}</p>
						)}
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label htmlFor="category">Kategori *</Label>
						<Select
							onValueChange={(value) => setValue("category", value)}
							defaultValue={campaign?.category || "sosial"}
						>
							<SelectTrigger>
								<SelectValue placeholder="Pilih kategori" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sosial">Sosial</SelectItem>
								<SelectItem value="pendidikan">Pendidikan</SelectItem>
								<SelectItem value="kesehatan">Kesehatan</SelectItem>
								<SelectItem value="bencana">Bencana</SelectItem>
								<SelectItem value="infrastruktur">Infrastruktur</SelectItem>
								<SelectItem value="lainnya">Lainnya</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Deskripsi Singkat *</Label>
						<Textarea
							id="description"
							{...register("description", {
								required: "Deskripsi wajib diisi",
							})}
							placeholder="Deskripsi singkat tentang campaign ini..."
							rows={3}
						/>
						{errors.description && (
							<p className="text-sm text-destructive">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Story */}
					<div className="space-y-2">
						<Label htmlFor="story">Cerita Lengkap *</Label>
						<Textarea
							id="story"
							{...register("story", { required: "Cerita wajib diisi" })}
							placeholder="Cerita lengkap dan detail tentang campaign ini..."
							rows={6}
						/>
						{errors.story && (
							<p className="text-sm text-destructive">{errors.story.message}</p>
						)}
					</div>

					{/* Target Amount */}
					<div className="space-y-2">
						<Label htmlFor="target_amount">Target Donasi (Rp) *</Label>
						<Input
							id="target_amount"
							type="number"
							{...register("target_amount", {
								required: "Target donasi wajib diisi",
								min: { value: 100000, message: "Minimal Rp 100.000" },
							})}
							placeholder="10000000"
						/>
						{errors.target_amount && (
							<p className="text-sm text-destructive">
								{errors.target_amount.message}
							</p>
						)}
					</div>

					{/* Date Range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="start_date">Tanggal Mulai *</Label>
							<Input
								id="start_date"
								type="date"
								{...register("start_date", {
									required: "Tanggal mulai wajib diisi",
								})}
							/>
							{errors.start_date && (
								<p className="text-sm text-destructive">
									{errors.start_date.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="end_date">Tanggal Berakhir *</Label>
							<Input
								id="end_date"
								type="date"
								{...register("end_date", {
									required: "Tanggal berakhir wajib diisi",
								})}
							/>
							{errors.end_date && (
								<p className="text-sm text-destructive">
									{errors.end_date.message}
								</p>
							)}
						</div>
					</div>

					{/* Urgency Level */}
					<div className="space-y-2">
						<Label htmlFor="urgency_level">Tingkat Urgensi *</Label>
						<Select
							onValueChange={(value) =>
								setValue(
									"urgency_level",
									value as "low" | "medium" | "high" | "critical"
								)
							}
							defaultValue={campaign?.urgency_level || "medium"}
						>
							<SelectTrigger>
								<SelectValue placeholder="Pilih tingkat urgensi" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Rendah</SelectItem>
								<SelectItem value="medium">Sedang</SelectItem>
								<SelectItem value="high">Tinggi</SelectItem>
								<SelectItem value="critical">Kritis</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Benefits */}
					<div className="space-y-2">
						<Label>Manfaat Donasi</Label>
						<div className="space-y-2">
							{benefits.map((benefit, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={benefit}
										onChange={(e) => handleBenefitChange(index, e.target.value)}
										placeholder={`Manfaat ${index + 1}`}
									/>
									{benefits.length > 1 && (
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={() => handleRemoveBenefit(index)}
										>
											<X className="w-4 h-4" />
										</Button>
									)}
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddBenefit}
							>
								<Plus className="w-4 h-4 mr-2" />
								Tambah Manfaat
							</Button>
						</div>
					</div>

					{/* Switches */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label>Publikasikan Campaign</Label>
								<p className="text-sm text-muted-foreground">
									Campaign akan tampil di halaman publik
								</p>
							</div>
							<Switch
								checked={isPublished}
								onCheckedChange={(checked) => setValue("is_published", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label>Tandai Sebagai Mendesak</Label>
								<p className="text-sm text-muted-foreground">
									Campaign akan ditampilkan sebagai prioritas
								</p>
							</div>
							<Switch
								checked={isUrgent}
								onCheckedChange={(checked) => setValue("is_urgent", checked)}
							/>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Batal
						</Button>
						<Button type="submit" disabled={isSubmitting || uploading}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Menyimpan...
								</>
							) : campaign ? (
								"Update Campaign"
							) : (
								"Buat Campaign"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
