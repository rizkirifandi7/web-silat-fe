"use client";

import { Campaign } from "@/lib/campaign-api";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCampaignDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaign: Campaign | null;
	onConfirm: () => Promise<boolean>;
}

export function DeleteCampaignDialog({
	open,
	onOpenChange,
	campaign,
	onConfirm,
}: DeleteCampaignDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hapus Campaign?</AlertDialogTitle>
					<AlertDialogDescription>
						Apakah Anda yakin ingin menghapus campaign{" "}
						<span className="font-semibold">{campaign?.title}</span>? Aksi ini
						tidak dapat dibatalkan.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Hapus
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
