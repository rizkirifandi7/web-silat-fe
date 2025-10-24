"use client";

import * as React from "react";
import { DataTable } from "./data-table";
import { getRekeningColumns } from "../data-table-colum/data-table-rekening-columns";
import { EditRekeningDialog } from "../edit-rekening-dialog";
import { DeleteRekeningDialog } from "../delete-dialog/delete-rekening-dialog";
import { TambahRekeningDialog } from "../tambah-rekening-dialog";
import { useRekeningCrud } from "@/hooks/use-rekening-crud";
import { Rekening } from "@/lib/schema";

export function DataTableRekening() {
    const { rekening, refreshRekening } = useRekeningCrud();
    const [editingRekening, setEditingRekening] = React.useState<Rekening | null>(null);
    const [deletingRekening, setDeletingRekening] = React.useState<Rekening | null>(
        null
    );

    const handleEdit = (rekening: Rekening) => {
        setEditingRekening(rekening);
    };

    const handleDelete = (rekening: Rekening) => {
        setDeletingRekening(rekening);
    };

    const columns = React.useMemo(
        () => getRekeningColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        []
    );

    return (
        <div className="w-full">
            {editingRekening && (
                <EditRekeningDialog
                    rekening={editingRekening}
                    onSuccess={() => {
                        refreshRekening();
                        setEditingRekening(null);
                    }}
                    onCancel={() => setEditingRekening(null)}
                />
            )}
            {deletingRekening && (
                <DeleteRekeningDialog
                    rekeningId={deletingRekening.id}
                    onSuccess={() => {
                        refreshRekening();
                        setDeletingRekening(null);
                    }}
                    onCancel={() => setDeletingRekening(null)}
                />
            )}
            <DataTable
                columns={columns}
                data={(rekening as Rekening[]) ?? []}
                filterColumn="namaBank"
                filterPlaceholder="Filter nama bank..."
                toolbar={<TambahRekeningDialog />}
            />
        </div>
    );
}