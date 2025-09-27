"use client";

import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Anggota } from "@/lib/schema";

interface DetailAnggotaDrawerProps {
	anggota: Anggota | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function DetailAnggotaDrawer({
	anggota,
	isOpen,
	onOpenChange,
}: DetailAnggotaDrawerProps) {
	if (!anggota) {
		return null;
	}

	console.log(anggota);

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent>
				<div className="mx-auto w-full max-w-md">
					<DrawerHeader className="text-center">
						<div className="flex flex-col items-center gap-4">
							<Avatar className="h-24 w-24">
								<AvatarImage src={anggota.foto} alt={anggota.nama} />
								<AvatarFallback>{anggota.nama.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<DrawerTitle className="text-2xl">{anggota.nama}</DrawerTitle>
								<DrawerDescription>{anggota.email}</DrawerDescription>
							</div>
						</div>
					</DrawerHeader>
					<div className="p-4 pb-0">
						<div className="flex items-center justify-center space-x-2">
							<Badge variant="outline">{anggota.tingkatan_sabuk}</Badge>
							<Badge
								variant={
									anggota.status_keanggotaan === "Aktif"
										? "default"
										: "destructive"
								}
							>
								{anggota.status_keanggotaan}
							</Badge>
							<Badge variant="secondary">
								Angkatan {anggota.angkatan_unit}
							</Badge>
						</div>
						<Separator className="my-4" />
						<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
							<div className="font-medium text-muted-foreground">
								Jenis Kelamin
							</div>
							<div>{anggota.jenis_kelamin}</div>

							<div className="font-medium text-muted-foreground">
								Tempat, Tanggal Lahir
							</div>
							<div>
								{anggota.tempat_lahir},{" "}
								{new Date(anggota.tanggal_lahir).toLocaleDateString("id-ID", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</div>

							<div className="font-medium text-muted-foreground">Agama</div>
							<div>{anggota.agama}</div>

							<div className="font-medium text-muted-foreground">
								No. Telepon
							</div>
							<div>{anggota.no_telepon}</div>

							<div className="font-medium text-muted-foreground">Alamat</div>
							<div className="col-span-1">{anggota.alamat}</div>
						</div>
					</div>
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">Tutup</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
