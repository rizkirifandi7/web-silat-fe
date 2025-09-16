import {
	IconUsers,
	IconUserCheck,
	IconUserExclamation,
	IconUserPlus,
} from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Anggota } from "@/lib/schema";

interface SectionCardsProps {
	data: Anggota[];
}

export function SectionCards({ data }: SectionCardsProps) {
	const totalAnggota = data.length;
	const anggotaAktif = data.filter(
		(anggota) => anggota.status_keanggotaan === "Aktif"
	).length;
	const anggotaPasif = data.filter(
		(anggota) =>
			anggota.status_keanggotaan === "Pasif" ||
			anggota.status_keanggotaan === "Tidak Aktif"
	).length;

	// Asumsi 'createdAt' ada di data Anda untuk menghitung anggota baru
	const anggotaBaruTahunIni = data.filter((anggota) => {
		if (!anggota.createdAt) return false;
		return new Date(anggota.createdAt).getFullYear() === new Date().getFullYear();
	}).length;

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardDescription>Total Anggota</CardDescription>
						<IconUsers className="h-6 w-6 text-muted-foreground" />
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{totalAnggota}
					</CardTitle>
				</CardHeader>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardDescription>Anggota Aktif</CardDescription>
						<IconUserCheck className="h-6 w-6 text-green-500" />
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{anggotaAktif}
					</CardTitle>
				</CardHeader>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardDescription>Anggota Pasif</CardDescription>
						<IconUserExclamation className="h-6 w-6 text-red-500" />
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{anggotaPasif}
					</CardTitle>
				</CardHeader>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardDescription>Anggota Baru (Tahun Ini)</CardDescription>
						<IconUserPlus className="h-6 w-6 text-blue-500" />
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{anggotaBaruTahunIni}
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
