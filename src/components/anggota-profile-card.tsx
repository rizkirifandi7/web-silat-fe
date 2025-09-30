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
			<CardHeader className="relative bg-gray-100 flex flex-col items-center justify-center  py-4 text-center dark:bg-black/10">
				<Avatar className="h-62 w-62 border-4 border-white shadow-md dark:border-gray-700 rounded-lg">
					<AvatarImage
						src={anggota.foto}
						alt={anggota.nama}
						className="object-cover"
					/>
					<AvatarFallback className="text-3xl font-bold">
						{getInitials(anggota.nama)}
					</AvatarFallback>
				</Avatar>
				<CardTitle className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
					{anggota.nama}
				</CardTitle>
				<div
					className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${
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
			</CardHeader>
			<CardContent className="p-6 border-t">
				<div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
					<div>
						<h3 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white text-center">
							Status Anggota
						</h3>
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
						<h3 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white text-center">
							Identitas Diri
						</h3>
						<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
							<div className="font-semibold text-left">Jenis Kelamin:</div>
							<div className="text-right">{anggota.jenis_kelamin}</div>

							<div className="font-semibold text-left">
								Tempat, Tanggal Lahir:
							</div>
							<div className="text-right">
								{anggota.tempat_lahir},{" "}
								{new Date(anggota.tanggal_lahir).toLocaleDateString("id-ID", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</div>

							<div className="font-semibold text-left">Agama:</div>
							<p className="text-right">{anggota.agama}</p>

							<div className="font-semibold text-left">No. Telepon:</div>
							<p className="text-right">{anggota.no_telepon}</p>

							<div className="font-semibold text-left">Alamat:</div>
							<p className="text-right">{anggota.alamat}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
