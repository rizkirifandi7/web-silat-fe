"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfilDialog } from "@/components/edit-profil-dialog";

interface User {
	id: number;
	nama: string;
	email: string;
	foto: string;
	role: string;
	id_token: string;
	createdAt: string;
	updatedAt: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	alamat: string;
	agama: string;
	jenis_kelamin: string;
	no_telepon: string;
	angkatan_unit: string;
	status_keanggotaan: string;
	tingkatan_sabuk: string;
	status_perguruan: string;
}

const Page = () => {
	const [user, setUser] = React.useState<User | null>(null);

	const token = Cookies.get("token");

	const fetchUserData = async (token: string) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/anggota/profile`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching user data:", error);
			return null;
		}
	};

	useEffect(() => {
		if (token) {
			fetchUserData(token).then((data) => {
				if (data) {
					setUser(data);
				}
			});
		}
	}, [token]);

	// Fungsi untuk refresh data setelah edit
	const handleEditSuccess = () => {
		if (token) {
			fetchUserData(token).then((data) => {
				if (data) {
					setUser(data);
				}
			});
		}
	};

	const formattedJoinDate = user?.createdAt
		? format(new Date(user.createdAt), "dd MMMM yyyy", { locale: id })
		: "Unknown";

	const formattedBirthDate = user?.tanggal_lahir
		? format(new Date(user.tanggal_lahir), "dd MMMM yyyy", { locale: id })
		: "Unknown";

	return (
		<div className="space-y-4 p-4 md:p-6">
			<h1 className="text-2xl font-bold">Profil</h1>
			<Card className="p-8 shadow-none">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-4">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1">
						<Avatar className="h-32 w-32 flex-shrink-0">
							<AvatarImage
								src={user?.foto}
								alt={user?.nama}
								className="object-cover"
							/>
							<AvatarFallback className="text-4xl">
								{user?.nama?.charAt(0)}
							</AvatarFallback>
						</Avatar>

						<div className="flex flex-col justify-center space-y-1 items-center md:items-start self-center">
							<p className="text-lg font-bold">{user?.nama || "Unknown"}</p>
							<p className="text-sm text-muted-foreground">
								{user?.email || "Unknown"}
							</p>
							<p className="text-sm text-muted-foreground">
								Bergabung pada: {formattedJoinDate || "Unknown"}
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<EditProfilDialog onEditSuccess={handleEditSuccess} />
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card className="space-y-2 px-4 gap-4 p-8 shadow-none">
					<h2 className="text-lg font-bold">Informasi Pribadi</h2>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Jenis Kelamin
						</h2>
						<p className="text-sm font-semibold">
							{user?.jenis_kelamin || "Unknown"}
						</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Tempat, Tanggal Lahir
						</h2>
						<p className="text-sm font-semibold">
							{user ? `${user.tempat_lahir}, ${formattedBirthDate}` : "Unknown"}
						</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Alamat
						</h2>
						<p className="text-sm font-semibold">{user?.alamat || "Unknown"}</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">Agama</h2>
						<p className="text-sm font-semibold">{user?.agama || "Unknown"}</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							No. Telepon
						</h2>
						<p className="text-sm font-semibold">
							{user?.no_telepon || "Unknown"}
						</p>
					</div>
				</Card>

				<Card className="space-y-2 px-4 gap-4 p-8 shadow-none">
					<h2 className="text-lg font-bold">Informasi Keanggotaan</h2>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Angkatan/Unit
						</h2>
						<p className="text-sm font-semibold">
							{user?.angkatan_unit || "Unknown"}
						</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Status Keanggotaan
						</h2>
						<p className="text-sm font-semibold">
							{user?.status_keanggotaan || "Unknown"}
						</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Status Perguruan
						</h2>
						<p className="text-sm font-semibold">
							{user?.status_perguruan || "Unknown"}
						</p>
					</div>
					<div>
						<h2 className="text-sm font-medium text-muted-foreground">
							Tingkatan Sabuk
						</h2>
						<p className="text-sm font-semibold">
							{user?.tingkatan_sabuk || "Unknown"}
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default Page;
