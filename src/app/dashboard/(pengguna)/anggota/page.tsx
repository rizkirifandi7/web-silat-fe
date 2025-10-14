"use client";

import React from "react";
import { useAnggotaCrud } from "@/hooks/use-anggota-crud";
import { DeleteAnggotaDialog } from "@/components/delete-dialog/delete-anggota-dialog";
import { EditAnggotaDialog } from "@/components/edit-anggota-dialog";
import { DetailAnggotaDrawer } from "@/components/detail-anggota-drawer";
import { KartuAnggotaDialog } from "@/components/kartu-anggota-dialog";
import { Anggota } from "@/lib/schema";
import { getAnggotaColumns } from "@/components/data-table-colum/data-table-anggota-columns";
import { DataTableAnggota } from "@/components/data-table/data-table-anggota";

type DialogState =
	| { type: "edit"; anggota: Anggota }
	| { type: "delete"; anggota: Anggota }
	| { type: "view"; anggota: Anggota }
	| { type: "card"; anggota: Anggota }
	| null;

const PageAnggota = () => {
	const { anggotas, isLoadingAnggotas, isErrorAnggotas } = useAnggotaCrud();
	const [dialog, setDialog] = React.useState<DialogState>(null);

	const columns = React.useMemo(
		() =>
			getAnggotaColumns({
				onEdit: (anggota) => setDialog({ type: "edit", anggota }),
				onDelete: (anggota) => setDialog({ type: "delete", anggota }),
				onViewDetails: (anggota) => setDialog({ type: "view", anggota }),
				onViewCard: (anggota) => setDialog({ type: "card", anggota }),
			}),
		[]
	);

	if (isLoadingAnggotas) {
		return <div>Loading...</div>;
	}

	if (isErrorAnggotas) {
		return <div>Error fetching data</div>;
	}

	return (
		<div className="flex flex-1 flex-col p-4 md:p-6">
			<h1 className="text-2xl font-bold">Manajemen Anggota</h1>
			<div className="">
				<DataTableAnggota columns={columns} data={anggotas || []} />
			</div>
			{dialog?.type === "edit" && (
				<EditAnggotaDialog
					anggota={dialog.anggota}
					open={dialog.type === "edit"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
			{dialog?.type === "delete" && (
				<DeleteAnggotaDialog
					anggota={dialog.anggota}
					open={dialog.type === "delete"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
			{dialog?.type === "view" && (
				<DetailAnggotaDrawer
					anggota={dialog.anggota}
					isOpen={dialog.type === "view"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
			{dialog?.type === "card" && (
				<KartuAnggotaDialog
					anggota={dialog.anggota}
					isOpen={dialog.type === "card"}
					onOpenChange={() => setDialog(null)}
				/>
			)}
		</div>
	);
};

export default PageAnggota;
