"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBook } from "@tabler/icons-react";


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

export default function DashboardAnggotaPage() {
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


	return (
		<div className="h-full w-full">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<Card className="p-8 shadow-none mt-2">
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
								Tingkat Sabuk : {user?.tingkatan_sabuk || "Unknown"}
							</p>
							<p className="text-sm text-muted-foreground">
								Angkatan Unit : {user?.angkatan_unit || "Unknown"}
							</p>
							<p className="text-sm text-muted-foreground">
								Status Keanggotaan : {user?.status_keanggotaan || "Unknown"}
							</p>
							<p className="text-sm text-muted-foreground">
								Status Perguruan : {user?.status_perguruan || "Unknown"}
							</p>
						</div>
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-3 gap-2 mt-4">
				<Card className="@container/card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardDescription>Total Materi</CardDescription>
						<IconBook className="h-6 w-6 text-blue-500" />
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						2
					</CardTitle>
				</CardHeader>
			</Card>
			</div>
		</div>
	);
}
