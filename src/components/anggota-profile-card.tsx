import { Anggota } from "@/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle,
	XCircle,
	Cake,
	Shield,
	Users,
	VenetianMask,
} from "lucide-react";

interface AnggotaProfileCardProps {
	anggota: Anggota;
}

export function AnggotaProfileCard({ anggota }: AnggotaProfileCardProps) {
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const calculateAge = (birthDate: string) => {
		const today = new Date();
		const birthDateObj = new Date(birthDate);
		let age = today.getFullYear() - birthDateObj.getFullYear();
		const monthDifference = today.getMonth() - birthDateObj.getMonth();
		if (
			monthDifference < 0 ||
			(monthDifference === 0 && today.getDate() < birthDateObj.getDate())
		) {
			age--;
		}
		return age;
	};

	return (
		<Card className="w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-gray-800 dark:to-gray-900">
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
				<Avatar className="h-28 w-28 border-4 border-white shadow-md dark:border-gray-700">
					<AvatarImage
						src={anggota.foto}
						alt={anggota.nama_lengkap}
						className="object-cover"
					/>
					<AvatarFallback className="text-3xl font-bold">
						{getInitials(anggota.nama_lengkap)}
					</AvatarFallback>
				</Avatar>
				<CardTitle className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
					{anggota.nama_lengkap}
				</CardTitle>
				<p className="font-mono text-xs text-gray-500 dark:text-gray-400">
					ID: {anggota.id_token}
				</p>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
					<div className="flex items-center">
						<Shield className="mr-3 h-5 w-5 " />
						<span className="font-semibold">Tingkatan:</span>
						<Badge className="ml-auto">{anggota.tingkatan_sabuk}</Badge>
					</div>
					<div className="flex items-center">
						<Cake className="mr-3 h-5 w-5 " />
						<span className="font-semibold">Umur:</span>
						<span className="ml-auto">
							{calculateAge(anggota.tanggal_lahir)} Tahun
						</span>
					</div>
					<div className="flex items-center">
						<Users className="mr-3 h-5 w-5" />
						<span className="font-semibold">Angkatan:</span>
						<span className="ml-auto">{anggota.angkatan_unit}</span>
					</div>
					<div className="flex items-center">
						<VenetianMask className="mr-3 h-5 w-5" />
						<span className="font-semibold">Status Perguruan:</span>
						<span className="ml-auto">{anggota.status_perguruan}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
