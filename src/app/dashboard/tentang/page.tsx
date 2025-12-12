"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";

interface PhilosophyItem {
	title: string;
	description: string;
}

interface ManagementMember {
	nama: string;
	jabatan: string;
	fotoUrl: string;
}

interface AboutData {
	id: number;
	historyTitle: string;
	historySubtitle: string;
	historyContent: string;
	visionTitle: string;
	visionContent: string;
	missionTitle: string;
	missionContent: string[];
	philosophyTitle: string;
	philosophySubtitle: string;
	philosophyItems: PhilosophyItem[];
	managementTitle: string;
	managementSubtitle: string;
	managementMembers: ManagementMember[];
	isActive: boolean;
}

export default function AboutPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [aboutData, setAboutData] = useState<AboutData | null>(null);
	const [uploadingPhotos, setUploadingPhotos] = useState<{
		[key: number]: boolean;
	}>({});
	const [formData, setFormData] = useState({
		historyTitle: "Sejarah Perguruan",
		historySubtitle: "",
		historyContent: "",
		visionTitle: "Visi",
		visionContent: "",
		missionTitle: "Misi",
		missionContent: [""],
		philosophyTitle: "Filosofi Lambang PUSAMADA",
		philosophySubtitle: "",
		philosophyItems: [] as PhilosophyItem[],
		managementTitle: "Struktur Kepengurusan",
		managementSubtitle: "",
		managementMembers: [] as ManagementMember[],
	});

	const fetchAboutData = useCallback(async () => {
		try {
			setLoading(true);
			console.log(
				"🔍 Fetching data from:",
				`${process.env.NEXT_PUBLIC_API_URL}/about/active`
			);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/about/active`
			);

			console.log("📊 Response status:", response.status);
			const result = await response.json();
			console.log("📦 Full Response:", JSON.stringify(result, null, 2));

			// Support both formats: {success: true} dan {status: "success"}
			const isSuccess = result.success === true || result.status === "success";
			const data = result.data;

			console.log("🔍 Checking success:", {
				isSuccess,
				hasData: !!data,
				dataKeys: data ? Object.keys(data) : [],
			});

			if (isSuccess && data) {
				console.log("✅ Data berhasil diambil:", {
					id: data.id,
					historyContent: data.historyContent?.length || 0,
					missionContent: Array.isArray(data.missionContent)
						? `Array dengan ${data.missionContent.length} items`
						: typeof data.missionContent,
					philosophyItems: Array.isArray(data.philosophyItems)
						? `Array dengan ${data.philosophyItems.length} items`
						: typeof data.philosophyItems,
					managementMembers: Array.isArray(data.managementMembers)
						? `Array dengan ${data.managementMembers.length} items`
						: typeof data.managementMembers,
				});

				setAboutData(data);

				const newFormData = {
					historyTitle: data.historyTitle || "Sejarah Perguruan",
					historySubtitle: data.historySubtitle || "",
					historyContent: data.historyContent || "",
					visionTitle: data.visionTitle || "Visi",
					visionContent: data.visionContent || "",
					missionTitle: data.missionTitle || "Misi",
					missionContent:
						Array.isArray(data.missionContent) && data.missionContent.length > 0
							? data.missionContent
							: [""],
					philosophyTitle: data.philosophyTitle || "Filosofi Lambang PUSAMADA",
					philosophySubtitle: data.philosophySubtitle || "",
					philosophyItems:
						Array.isArray(data.philosophyItems) &&
						data.philosophyItems.length > 0
							? data.philosophyItems
							: [],
					managementTitle: data.managementTitle || "Struktur Kepengurusan",
					managementSubtitle: data.managementSubtitle || "",
					managementMembers:
						Array.isArray(data.managementMembers) &&
						data.managementMembers.length > 0
							? data.managementMembers
							: [],
				};

				setFormData(newFormData);

				console.log("✅ Form data berhasil di-set:", {
					missionItems: newFormData.missionContent.length,
					philosophyItems: newFormData.philosophyItems.length,
					managementMembers: newFormData.managementMembers.length,
				});
			} else {
				console.log("⚠️ Data tidak ditemukan atau tidak valid", {
					isSuccess,
					hasData: !!data,
					result,
				});
			}
		} catch (error) {
			console.error("❌ Error fetching about data:", error);
			toast.error("Gagal mengambil data konten tentang");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAboutData();
	}, [fetchAboutData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.historyContent) {
			toast.error("Konten sejarah wajib diisi");
			return;
		}

		try {
			setSaving(true);

			const token = Cookies.get("accessToken");

			console.log("🔐 Checking token:", {
				hasToken: !!token,
				tokenLength: token?.length,
				tokenPreview: token ? `${token.substring(0, 20)}...` : "null",
			});

			if (!token) {
				toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
				console.error("❌ No access token found in cookies");
				// Redirect to login
				window.location.href = "/login";
				return;
			}

			const payload = {
				...formData,
				isActive: true,
			};

			console.log("📤 Sending request:", {
				method: aboutData?.id ? "PUT" : "POST",
				url: aboutData?.id
					? `${process.env.NEXT_PUBLIC_API_URL}/about/${aboutData.id}`
					: `${process.env.NEXT_PUBLIC_API_URL}/about`,
				payloadKeys: Object.keys(payload),
			});

			let response;
			if (aboutData?.id) {
				// Update existing
				response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/about/${aboutData.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(payload),
					}
				);
			} else {
				// Create new
				response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				});
			}

			console.log("📊 Response status:", response.status);
			const data = await response.json();
			console.log("📦 Response data:", data);

			// Handle authentication errors
			if (response.status === 401 || response.status === 403) {
				toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
				console.error("❌ Authentication failed:", data);
				setTimeout(() => {
					window.location.href = "/login";
				}, 2000);
				return;
			}

			if (data.success || response.ok) {
				toast.success(
					aboutData?.id
						? "Konten berhasil diperbarui"
						: "Konten berhasil dibuat"
				);
				fetchAboutData();
			} else {
				toast.error(data.message || "Gagal menyimpan konten");
			}
		} catch (error) {
			console.error("❌ Error saving about data:", error);
			toast.error("Gagal menyimpan konten. Silakan coba lagi.");
		} finally {
			setSaving(false);
		}
	};

	// Mission Handlers
	const addMission = () => {
		setFormData({
			...formData,
			missionContent: [...formData.missionContent, ""],
		});
	};

	const removeMission = (index: number) => {
		const newMissions = formData.missionContent.filter((_, i) => i !== index);
		setFormData({ ...formData, missionContent: newMissions });
	};

	const updateMission = (index: number, value: string) => {
		const newMissions = [...formData.missionContent];
		newMissions[index] = value;
		setFormData({ ...formData, missionContent: newMissions });
	};

	// Philosophy Handlers
	const addPhilosophyItem = () => {
		setFormData({
			...formData,
			philosophyItems: [
				...formData.philosophyItems,
				{ title: "", description: "" },
			],
		});
	};

	const removePhilosophyItem = (index: number) => {
		const newItems = formData.philosophyItems.filter((_, i) => i !== index);
		setFormData({ ...formData, philosophyItems: newItems });
	};

	const updatePhilosophyItem = (
		index: number,
		field: keyof PhilosophyItem,
		value: string
	) => {
		const newItems = [...formData.philosophyItems];
		newItems[index][field] = value;
		setFormData({ ...formData, philosophyItems: newItems });
	};

	// Management Handlers
	const addManagementMember = () => {
		setFormData({
			...formData,
			managementMembers: [
				...formData.managementMembers,
				{ nama: "", jabatan: "", fotoUrl: "" },
			],
		});
	};

	const removeManagementMember = (index: number) => {
		const newMembers = formData.managementMembers.filter((_, i) => i !== index);
		setFormData({ ...formData, managementMembers: newMembers });
	};

	const updateManagementMember = (
		index: number,
		field: keyof ManagementMember,
		value: string
	) => {
		const newMembers = [...formData.managementMembers];
		newMembers[index][field] = value;
		setFormData({ ...formData, managementMembers: newMembers });
	};

	// Photo Upload Handler dengan client-side compression
	const handlePhotoUpload = async (index: number, file: File) => {
		if (!file) return;

		// Validasi file
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
			return;
		}

		try {
			setUploadingPhotos({ ...uploadingPhotos, [index]: true });

			// Client-side compression menggunakan canvas
			const compressedFile = await compressImage(file, 0.8, 1200);

			const formDataUpload = new FormData();
			formDataUpload.append("foto", compressedFile);

			const token = Cookies.get("accessToken");
			if (!token) {
				toast.error("Sesi berakhir. Silakan login kembali.");
				window.location.href = "/login";
				return;
			}

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/upload/anggota`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formDataUpload,
				}
			);

			if (!response.ok) {
				throw new Error("Upload gagal");
			}

			const result = await response.json();
			const photoUrl = result.data?.url || result.url;

			if (!photoUrl) {
				throw new Error("URL foto tidak ditemukan");
			}

			updateManagementMember(index, "fotoUrl", photoUrl);
			toast.success("Foto berhasil diupload dan dioptimasi");
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Gagal upload foto. Silakan coba lagi.");
		} finally {
			setUploadingPhotos({ ...uploadingPhotos, [index]: false });
		}
	};

	// Fungsi kompresi gambar di client-side
	const compressImage = (
		file: File,
		quality: number = 0.8,
		maxWidth: number = 1200
	): Promise<File> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = (event) => {
				const img = new window.Image();
				img.src = event.target?.result as string;

				img.onload = () => {
					const canvas = document.createElement("canvas");
					let width = img.width;
					let height = img.height;

					// Resize jika lebih besar dari maxWidth
					if (width > maxWidth) {
						height = (height * maxWidth) / width;
						width = maxWidth;
					}

					canvas.width = width;
					canvas.height = height;

					const ctx = canvas.getContext("2d");
					if (!ctx) {
						reject(new Error("Canvas context not available"));
						return;
					}

					ctx.drawImage(img, 0, 0, width, height);

					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error("Canvas to Blob failed"));
								return;
							}

							const compressedFile = new File([blob], file.name, {
								type: file.type,
								lastModified: Date.now(),
							});

							resolve(compressedFile);
						},
						file.type,
						quality
					);
				};

				img.onerror = () => {
					reject(new Error("Image load failed"));
				};
			};

			reader.onerror = () => {
				reject(new Error("File read failed"));
			};
		});
	};

	const removePhoto = (index: number) => {
		updateManagementMember(index, "fotoUrl", "");
		toast.success("Foto dihapus");
	};

	if (loading) {
		return (
			<div className="container mx-auto py-10">
				<div className="flex items-center justify-center h-96">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10 max-w-6xl">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Manajemen Halaman Tentang Kami</h1>
				<p className="text-muted-foreground">
					Kelola semua konten halaman &quot;Tentang&quot; yang ditampilkan di
					website
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<Tabs defaultValue="sejarah" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="sejarah">Sejarah</TabsTrigger>
						<TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
						<TabsTrigger value="filosofi">Filosofi Lambang</TabsTrigger>
						<TabsTrigger value="kepengurusan">Kepengurusan</TabsTrigger>
					</TabsList>

					{/* Sejarah Tab */}
					<TabsContent value="sejarah">
						<Card>
							<CardHeader>
								<CardTitle>Sejarah Perguruan</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="historyTitle">Judul *</Label>
									<Input
										id="historyTitle"
										value={formData.historyTitle}
										onChange={(e) =>
											setFormData({ ...formData, historyTitle: e.target.value })
										}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="historySubtitle">Subjudul</Label>
									<Input
										id="historySubtitle"
										value={formData.historySubtitle}
										onChange={(e) =>
											setFormData({
												...formData,
												historySubtitle: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="historyContent">Konten Sejarah *</Label>
									<Textarea
										id="historyContent"
										value={formData.historyContent}
										onChange={(e) =>
											setFormData({
												...formData,
												historyContent: e.target.value,
											})
										}
										rows={10}
										required
										placeholder="Ceritakan sejarah perguruan..."
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Visi & Misi Tab */}
					<TabsContent value="visi-misi">
						<div className="space-y-4">
							{/* Visi Card */}
							<Card>
								<CardHeader>
									<CardTitle>Visi</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="visionTitle">Judul Visi</Label>
										<Input
											id="visionTitle"
											value={formData.visionTitle}
											onChange={(e) =>
												setFormData({
													...formData,
													visionTitle: e.target.value,
												})
											}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="visionContent">Konten Visi</Label>
										<Textarea
											id="visionContent"
											value={formData.visionContent}
											onChange={(e) =>
												setFormData({
													...formData,
													visionContent: e.target.value,
												})
											}
											rows={4}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Misi Card */}
							<Card>
								<CardHeader>
									<CardTitle>Misi</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="missionTitle">Judul Misi</Label>
										<Input
											id="missionTitle"
											value={formData.missionTitle}
											onChange={(e) =>
												setFormData({
													...formData,
													missionTitle: e.target.value,
												})
											}
										/>
									</div>

									<div className="space-y-2">
										<Label>Daftar Misi</Label>
										{formData.missionContent.map((mission, index) => (
											<div key={index} className="flex gap-2">
												<Input
													value={mission}
													onChange={(e) => updateMission(index, e.target.value)}
													placeholder={`Misi ${index + 1}`}
												/>
												<Button
													type="button"
													variant="destructive"
													size="icon"
													onClick={() => removeMission(index)}
													disabled={formData.missionContent.length === 1}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											onClick={addMission}
											className="w-full"
										>
											<Plus className="mr-2 h-4 w-4" />
											Tambah Misi
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Filosofi Tab */}
					<TabsContent value="filosofi">
						<Card>
							<CardHeader>
								<CardTitle>Filosofi Lambang</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="philosophyTitle">Judul</Label>
									<Input
										id="philosophyTitle"
										value={formData.philosophyTitle}
										onChange={(e) =>
											setFormData({
												...formData,
												philosophyTitle: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="philosophySubtitle">Subjudul</Label>
									<Input
										id="philosophySubtitle"
										value={formData.philosophySubtitle}
										onChange={(e) =>
											setFormData({
												...formData,
												philosophySubtitle: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label>Item Filosofi</Label>
									{formData.philosophyItems.map((item, index) => (
										<Card key={index} className="p-4">
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<Label>Item {index + 1}</Label>
													<Button
														type="button"
														variant="destructive"
														size="icon"
														onClick={() => removePhilosophyItem(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
												<Input
													value={item.title}
													onChange={(e) =>
														updatePhilosophyItem(index, "title", e.target.value)
													}
													placeholder="Judul (contoh: Bintang)"
												/>
												<Textarea
													value={item.description}
													onChange={(e) =>
														updatePhilosophyItem(
															index,
															"description",
															e.target.value
														)
													}
													placeholder="Deskripsi filosofi"
													rows={2}
												/>
											</div>
										</Card>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={addPhilosophyItem}
										className="w-full"
									>
										<Plus className="mr-2 h-4 w-4" />
										Tambah Item Filosofi
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Kepengurusan Tab */}
					<TabsContent value="kepengurusan">
						<Card>
							<CardHeader>
								<CardTitle>Struktur Kepengurusan</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="managementTitle">Judul</Label>
									<Input
										id="managementTitle"
										value={formData.managementTitle}
										onChange={(e) =>
											setFormData({
												...formData,
												managementTitle: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="managementSubtitle">Subjudul</Label>
									<Input
										id="managementSubtitle"
										value={formData.managementSubtitle}
										onChange={(e) =>
											setFormData({
												...formData,
												managementSubtitle: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label>Anggota Kepengurusan</Label>
									{formData.managementMembers.map((member, index) => (
										<Card key={index} className="p-4">
											<div className="space-y-4">
												<div className="flex justify-between items-center">
													<Label>Anggota {index + 1}</Label>
													<Button
														type="button"
														variant="destructive"
														size="icon"
														onClick={() => removeManagementMember(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
												<Input
													value={member.nama}
													onChange={(e) =>
														updateManagementMember(
															index,
															"nama",
															e.target.value
														)
													}
													placeholder="Nama Lengkap"
												/>
												<Input
													value={member.jabatan}
													onChange={(e) =>
														updateManagementMember(
															index,
															"jabatan",
															e.target.value
														)
													}
													placeholder="Jabatan"
												/>

												{/* Photo Upload Section */}
												<div className="space-y-2">
													<Label>Foto Anggota</Label>
													{member.fotoUrl ? (
														<div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
															<Image
																src={member.fotoUrl}
																alt={member.nama || "Foto anggota"}
																fill
																className="object-cover"
															/>
															<Button
																type="button"
																variant="destructive"
																size="icon"
																className="absolute top-1 right-1 h-6 w-6"
																onClick={() => removePhoto(index)}
															>
																<X className="h-3 w-3" />
															</Button>
														</div>
													) : (
														<div className="flex items-center gap-2">
															<Input
																id={`photo-${index}`}
																type="file"
																accept="image/jpeg,image/jpg,image/png,image/webp"
																onChange={(e) => {
																	const file = e.target.files?.[0];
																	if (file) handlePhotoUpload(index, file);
																}}
																disabled={uploadingPhotos[index]}
																className="cursor-pointer"
															/>
															{uploadingPhotos[index] && (
																<Loader2 className="h-4 w-4 animate-spin" />
															)}
														</div>
													)}
													<p className="text-xs text-muted-foreground">
														Format: JPG, PNG, WebP. Maksimal 5MB.
													</p>
												</div>
											</div>
										</Card>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={addManagementMember}
										className="w-full"
									>
										<Plus className="mr-2 h-4 w-4" />
										Tambah Anggota
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end gap-2 mt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => fetchAboutData()}
						disabled={saving}
					>
						Batal
					</Button>
					<Button type="submit" disabled={saving}>
						{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{saving ? "Menyimpan..." : "Simpan Perubahan"}
					</Button>
				</div>
			</form>
		</div>
	);
}
