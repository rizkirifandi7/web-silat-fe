"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
			<Card className="p-4">
				<CardContent className="text-lg font-semibold">
					<div className="flex flex-col justify-center items-center">
						<Avatar className="mb-5 h-32 w-32">
                            <AvatarImage 
								src={user?.foto}
								alt={user?.nama} 
								className="object-cover"
							/>
							<AvatarFallback className="text-4xl">{user?.nama?.charAt(0)}</AvatarFallback>
						</Avatar>
					</div>
					<div className="space-y-2 grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h2 className="text-sm font-semibold">Nama</h2>
							<p className="text-sm font-medium text-muted-foreground">{user?.nama || "Unknown"}</p>
						</div>
						<div>
							<h2 className="text-sm font-semibold">Email</h2>
							<p className="text-sm font-medium text-muted-foreground">{user?.email || "Unknown"}</p>
						</div>
						<div>
							<h2 className="text-sm font-semibold">Tanggal Bergabung</h2>
							<p className="text-sm font-medium text-muted-foreground">{formattedJoinDate}</p>
						</div>
						<div>
							<h2 className="text-sm font-semibold">Tempat, Tanggal Lahir</h2>
							<p className="text-sm font-medium text-muted-foreground">{user ? `${user.tempat_lahir}, ${formattedBirthDate}` : "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Alamat</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.alamat || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Agama</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.agama || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Jenis Kelamin</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.jenis_kelamin || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">No. Telepon</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.no_telepon || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Angkatan/Unit</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.angkatan_unit || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Status Keanggotaan</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.status_keanggotaan || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Tingkatan Sabuk</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.tingkatan_sabuk || "Unknown"}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Status Perguruan</h2>
                            <p className="text-sm font-medium text-muted-foreground">{user?.status_perguruan || "Unknown"}</p>
                        </div>
						<div>
							<h2 className="text-sm font-semibold">Role</h2>
							<p className="text-sm font-medium text-muted-foreground">{user?.role || "Unknown"}</p>
						</div>
					</div>
				</CardContent>
                <CardFooter className="">
					<EditProfilDialog 
						onEditSuccess={handleEditSuccess}
					/>
                </CardFooter>
			</Card>
		</div>
	);
};

export default Page;