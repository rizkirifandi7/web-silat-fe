"use client";

import { useState } from "react";
import { useCampaignCrud } from "@/hooks/use-campaign-crud";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CampaignFormDialog } from "@/components/dialogs/campaign-form-dialog";
import { DeleteCampaignDialog } from "@/components/dialogs/delete-campaign-dialog";
import {
	MoreHorizontal,
	Plus,
	Edit,
	Trash2,
	Search,
	Eye,
	CheckCircle,
	XCircle,
} from "lucide-react";
import Image from "next/image";

const formatRupiah = (amount: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(amount);
};

const getStatusBadge = (status: string) => {
	const variants: Record<
		string,
		"secondary" | "default" | "destructive" | "outline"
	> = {
		draft: "secondary",
		active: "default",
		completed: "default",
		cancelled: "destructive",
	};

	const labels: Record<string, string> = {
		draft: "Draft",
		active: "Aktif",
		completed: "Selesai",
		cancelled: "Dibatalkan",
	};

	return (
		<Badge variant={variants[status] || "secondary"}>
			{labels[status] || status}
		</Badge>
	);
};

const getUrgencyBadge = (level: string) => {
	const variants: Record<
		string,
		"secondary" | "default" | "destructive" | "outline"
	> = {
		low: "secondary",
		medium: "default",
		high: "destructive",
		critical: "destructive",
	};

	const labels: Record<string, string> = {
		low: "Rendah",
		medium: "Sedang",
		high: "Tinggi",
		critical: "Kritis",
	};

	return (
		<Badge variant={variants[level] || "secondary"}>
			{labels[level] || level}
		</Badge>
	);
};

export function DataTableCampaign() {
	const {
		campaigns,
		loading,
		selectedCampaign,
		isDialogOpen,
		isDeleteDialogOpen,
		pagination,
		setIsDialogOpen,
		setIsDeleteDialogOpen,
		fetchCampaigns,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleUploadImage,
		openCreateDialog,
		openEditDialog,
		openDeleteDialog,
	} = useCampaignCrud();

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const handleSearch = () => {
		fetchCampaigns({
			search: searchQuery,
			status: statusFilter === "all" ? undefined : statusFilter,
		});
	};

	const handlePageChange = (newPage: number) => {
		fetchCampaigns({ page: newPage });
	};

	return (
		<div className="space-y-4">
			{/* Header Actions */}
			<div className="flex flex-col sm:flex-row gap-4 justify-between">
				<div className="flex gap-2">
					<div className="relative flex-1 sm:flex-initial sm:w-80">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="Cari campaign..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							className="pl-10"
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Semua Status</SelectItem>
							<SelectItem value="draft">Draft</SelectItem>
							<SelectItem value="active">Aktif</SelectItem>
							<SelectItem value="completed">Selesai</SelectItem>
							<SelectItem value="cancelled">Dibatalkan</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={handleSearch} variant="outline">
						Cari
					</Button>
				</div>
				<Button onClick={openCreateDialog}>
					<Plus className="w-4 h-4 mr-2" />
					Tambah Campaign
				</Button>
			</div>

			{/* Table */}
			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Gambar</TableHead>
							<TableHead>Judul</TableHead>
							<TableHead>Kategori</TableHead>
							<TableHead>Target</TableHead>
							<TableHead>Terkumpul</TableHead>
							<TableHead>Progress</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Urgensi</TableHead>
							<TableHead>Publish</TableHead>
							<TableHead className="text-right">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={10} className="text-center py-10">
									Loading...
								</TableCell>
							</TableRow>
						) : campaigns.length === 0 ? (
							<TableRow>
								<TableCell colSpan={10} className="text-center py-10">
									Tidak ada data campaign
								</TableCell>
							</TableRow>
						) : (
							campaigns.map((campaign) => (
								<TableRow key={campaign.id}>
									<TableCell>
										{campaign.image_url ? (
											<Image
												src={campaign.image_url}
												alt={campaign.title}
												width={80}
												height={60}
												className="rounded object-cover"
											/>
										) : (
											<div className="w-20 h-[60px] rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
												No Image
											</div>
										)}
									</TableCell>
									<TableCell>
										<div className="font-medium">{campaign.title}</div>
										<div className="text-sm text-muted-foreground">
											{campaign.slug}
										</div>
									</TableCell>
									<TableCell className="capitalize">
										{campaign.category}
									</TableCell>
									<TableCell>{formatRupiah(campaign.target_amount)}</TableCell>
									<TableCell>
										{formatRupiah(campaign.collected_amount)}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${Math.min(
															(campaign.collected_amount /
																campaign.target_amount) *
																100,
															100
														)}%`,
													}}
												/>
											</div>
											<span className="text-sm text-nowrap">
												{(
													(campaign.collected_amount / campaign.target_amount) *
													100
												).toFixed(0)}
												%
											</span>
										</div>
									</TableCell>
									<TableCell>{getStatusBadge(campaign.status)}</TableCell>
									<TableCell>
										{getUrgencyBadge(campaign.urgency_level)}
									</TableCell>
									<TableCell>
										{campaign.is_published ? (
											<CheckCircle className="w-5 h-5 text-green-500" />
										) : (
											<XCircle className="w-5 h-5 text-gray-400" />
										)}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="w-4 h-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														window.open(`/donasi/${campaign.slug}`, "_blank")
													}
												>
													<Eye className="w-4 h-4 mr-2" />
													Lihat Detail
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openEditDialog(campaign)}
												>
													<Edit className="w-4 h-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openDeleteDialog(campaign)}
													className="text-destructive"
												>
													<Trash2 className="w-4 h-4 mr-2" />
													Hapus
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{pagination.total_pages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
						{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
						{pagination.total} campaigns
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.page - 1)}
							disabled={pagination.page === 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.page + 1)}
							disabled={pagination.page === pagination.total_pages}
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Dialogs */}
			<CampaignFormDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				campaign={selectedCampaign}
				onSubmit={
					selectedCampaign
						? (data) => handleUpdate(selectedCampaign.id, data)
						: handleCreate
				}
				onUploadImage={handleUploadImage}
			/>

			<DeleteCampaignDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				campaign={selectedCampaign}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
