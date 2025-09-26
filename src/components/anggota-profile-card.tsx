import { Anggota } from "@/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";

interface AnggotaProfileCardProps {
	anggota: Anggota;
}

export function AnggotaProfileCard({ anggota }: AnggotaProfileCardProps) {
	if (!anggota) {
		return (
			<Card className="w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg dark:from-gray-800 dark:to-gray-900">
				<CardHeader className="flex flex-col items-center justify-center p-6 text-center">
					<CardTitle>Memuat Data Anggota...</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-4">
						<div className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
						<div className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
						<div className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getInitials = (name: string) => {
		if (!name) return "?";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<Card className="w-full max-w-md overflow-hidden rounded-2xl shadow transition-all duration-300 hover:shadow-xl dark:from-gray-800 dark:to-gray-900">
			<CardHeader className="relative flex flex-col items-center justify-center bg-gray-900/5 p-6 text-center dark:bg-black/10">
				<div
					className={`absolute top-4 right-4 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${
						anggota.status_keanggotaan === "Aktif"
							? "bg-green-500"
							: "bg-red-500"
					}`}
				>
					{anggota.status_keanggotaan === "Aktif" ? (
						<CheckCircle className="h-4 w-4" />
					) : (
						<XCircle className="h-4 w-4" />
					)}
					<span>{anggota.status_keanggotaan}</span>
				</div>
				<Avatar className="h-40 w-40 border-4 border-white shadow-md dark:border-gray-700 rounded-none">
					<AvatarImage
						src={anggota.foto}
						alt={anggota.user.nama}
						className="object-cover"
					/>
					<AvatarFallback className="text-3xl font-bold">
						{getInitials(anggota.user.nama)}
					</AvatarFallback>
				</Avatar>
				<CardTitle className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
					{anggota.user.nama}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
					<div>
						<div className="space-y-2">
							<div className="flex items-center">
								<span className="font-semibold">Tingkatan:</span>
								<Badge className="ml-auto">{anggota.tingkatan_sabuk}</Badge>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">Angkatan:</span>
								<span className="ml-auto">{anggota.angkatan_unit}</span>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">Status Perguruan:</span>
								<span className="ml-auto">{anggota.status_perguruan}</span>
							</div>
						</div>
					</div>
					<Separator />
					<div>
						<h3 className="mb-2 font-semibold text-base text-gray-800 dark:text-white">
							Identitas Diri
						</h3>
						<div className="space-y-2">
							<div className="flex items-center">
								<span className="font-semibold">Jenis Kelamin:</span>
								<span className="ml-auto">{anggota.jenis_kelamin}</span>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">Tempat Lahir:</span>
								<span className="ml-auto">{anggota.tempat_lahir}</span>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">Tanggal Lahir:</span>
								<span className="ml-auto">
									{new Date(anggota.tanggal_lahir).toLocaleDateString("id-ID")}
								</span>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">Alamat:</span>
								<span className="ml-auto">{anggota.alamat}</span>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">No. Telepon:</span>
								<span className="ml-auto">{anggota.no_telepon}</span>
							</div>
							<div className="flex items-center">
								<span className="font-semibold">Agama:</span>
								<span className="ml-auto">{anggota.agama}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
