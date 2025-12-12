"use client";

import React from "react";
import { useAnggotaCrud } from "@/hooks/use-anggota-crud";
import { DeleteAnggotaDialog } from "@/components/delete-dialog/delete-anggota-dialog";
import { EditAnggotaDialog } from "@/components/edit-anggota-dialog";
import { DetailAnggotaDrawer } from "@/components/detail-anggota-drawer";
import { KartuAnggotaDialog } from "@/components/kartu-anggota-dialog";
import { Anggota } from "@/lib/schema";
import { getAnggotaColumns } from "@/components/data-table-colum/data-table-anggota-columns";
import { DataTableAnggota } from "@/components/data-table/data-table-anggota";
import { StatsCard } from "@/components/stats-card";
import { Users, UserCheck, Award, Ban, Filter } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type DialogState =
	| { type: "edit"; anggota: Anggota }
	| { type: "delete"; anggota: Anggota }
	| { type: "view"; anggota: Anggota }
	| { type: "card"; anggota: Anggota }
	| null;

const PageAnggota = () => {
	const {
		anggotas,
		isLoadingAnggotas,
		isErrorAnggotas,
		stats,
		isLoadingStats,
	} = useAnggotaCrud();
	const [dialog, setDialog] = React.useState<DialogState>(null);
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [tingkatanFilter, setTingkatanFilter] = React.useState<string>("all");

	// Filter data berdasarkan status dan tingkatan
	const filteredAnggotas = React.useMemo(() => {
		if (!anggotas) return [];
		return anggotas.filter((anggota) => {
			const matchStatus =
				statusFilter === "all" || anggota.status_keanggotaan === statusFilter;
			const matchTingkatan =
				tingkatanFilter === "all" ||
				anggota.tingkatan_sabuk === tingkatanFilter;
			return matchStatus && matchTingkatan;
		});
	}, [anggotas, statusFilter, tingkatanFilter]);

	const columns = React.useMemo(
		() =>
			getAnggotaColumns({
				onEdit: (anggota) => setDialog({ type: "edit", anggota }),
				onDelete: (anggota) => setDialog({ type: "delete", anggota }),
				onViewDetails: (anggota) => setDialog({ type: "view", anggota }),
				onViewCard: (anggota) => setDialog({ type: "card", anggota }),
			}),
		[]
	);

	if (isLoadingAnggotas) {
		return (
			<div>
				<Skeleton className="h-8 w-1/3 mb-4" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-20 w-full" />
				</div>
				<Skeleton className="h-10 w-full mb-4" />
				<Skeleton className="h-[500px] w-full" />
			</div>
		);
	}

	if (isErrorAnggotas) {
		return <div>Error fetching data</div>;
	}

	return (
		<div className="flex flex-1 flex-col p-4 md:p-6">
			<h1 className="text-2xl font-bold mb-6">Manajemen Anggota</h1>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
				<StatsCard
					title="Total Anggota"
					value={isLoadingStats ? "..." : stats?.totalMembers || 0}
					description="Jumlah seluruh anggota"
					icon={Users}
					iconColor="text-blue-600"
				/>
				<StatsCard
					title="Status Aktif"
					value={isLoadingStats ? "..." : stats?.activeMembers || 0}
					description="Anggota dengan status aktif"
					icon={UserCheck}
					iconColor="text-green-600"
				/>
				<StatsCard
					title="Memiliki Sabuk"
					value={isLoadingStats ? "..." : stats?.membersWithBelt || 0}
					description="Anggota yang sudah memiliki sabuk"
					icon={Award}
					iconColor="text-yellow-600"
				/>
				<StatsCard
					title="Belum Punya Sabuk"
					value={isLoadingStats ? "..." : stats?.membersWithoutBelt || 0}
					description="Anggota yang belum memiliki sabuk"
					icon={Ban}
					iconColor="text-red-600"
				/>
			</div>

			{/* Filter Section */}
			<Card className="mb-6">
				<CardContent className="pt-6">
					<div className="flex items-center gap-2 mb-4">
						<Filter className="h-4 w-4" />
						<h3 className="text-sm font-semibold">Filter Data</h3>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-2 col-span-2">
							<Label htmlFor="status-filter">Status Keanggotaan</Label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger id="status-filter" className="w-full">
									<SelectValue placeholder="Pilih status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Semua Status</SelectItem>
									<SelectItem value="Aktif">Aktif</SelectItem>
									<SelectItem value="Pasif">Pasif</SelectItem>
									<SelectItem value="Non Aktif">Non Aktif</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2 col-span-2">
							<Label htmlFor="tingkatan-filter">Tingkatan Sabuk</Label>
							<Select
								value={tingkatanFilter}
								onValueChange={setTingkatanFilter}
							>
								<SelectTrigger id="tingkatan-filter" className="w-full">
									<SelectValue placeholder="Pilih tingkatan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Semua Tingkatan</SelectItem>
									<SelectItem value="Belum punya">Belum punya</SelectItem>
									<SelectItem value="LULUS Binfistal">
										LULUS Binfistal
									</SelectItem>
									<SelectItem value="Sabuk Hitam Wiraga 1">
										Sabuk Hitam Wiraga 1
									</SelectItem>
									<SelectItem value="Sabuk Hitam Wiraga 2">
										Sabuk Hitam Wiraga 2
									</SelectItem>
									<SelectItem value="Sabuk Hitam Wiraga 3">
										Sabuk Hitam Wiraga 3
									</SelectItem>
									<SelectItem value="Sabuk Hijau">Sabuk Hijau</SelectItem>
									<SelectItem value="Sabuk Merah">Sabuk Merah</SelectItem>
									<SelectItem value="Sabuk Putih">Sabuk Putih</SelectItem>
									<SelectItem value="Sabuk Kuning">Sabuk Kuning</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-end col-span-4 text-center">
							<p className="text-sm text-muted-foreground">
								Menampilkan {filteredAnggotas.length} dari{" "}
								{anggotas?.length || 0} anggota
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="">
				<DataTableAnggota columns={columns} data={filteredAnggotas} />
			</div>
			{dialog?.type === "edit" && (
				<EditAnggotaDialog
					anggota={dialog.anggota}
					open={dialog.type === "edit"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
			{dialog?.type === "delete" && (
				<DeleteAnggotaDialog
					anggota={dialog.anggota}
					open={dialog.type === "delete"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
			{dialog?.type === "view" && (
				<DetailAnggotaDrawer
					anggota={dialog.anggota}
					isOpen={dialog.type === "view"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
			{dialog?.type === "card" && (
				<KartuAnggotaDialog
					anggota={dialog.anggota}
					isOpen={dialog.type === "card"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
		</div>
	);
};

export default PageAnggota;

