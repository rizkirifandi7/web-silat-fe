"use client";

import { Anggota } from "@/lib/schema";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { KartuAnggota } from "./kartu-anggota";

interface KartuAnggotaDialogProps {
	anggota: Anggota | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function KartuAnggotaDialog({
	anggota,
	isOpen,
	onOpenChange,
}: KartuAnggotaDialogProps) {
	if (!anggota) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Kartu Anggota - {anggota.user.nama}</DialogTitle>
				</DialogHeader>
				<div className="flex justify-center p-4">
					<KartuAnggota anggota={anggota} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
