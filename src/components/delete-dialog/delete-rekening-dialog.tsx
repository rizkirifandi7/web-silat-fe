"use client";

import { useRekeningCrud } from "@/hooks/use-rekening-crud";
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog";

interface DeleteRekeningDialogProps {
    rekeningId: number;
    onSuccess: () => void;
    onCancel: () => void;
}
export function DeleteRekeningDialog({
    rekeningId,
    onSuccess,
    onCancel,
}: DeleteRekeningDialogProps) {
    const { removeRekening, isDeleting } = useRekeningCrud();

    const handleDelete = async () => {
        try {
            await removeRekening(rekeningId);
            onSuccess();
        } catch (error) {
            // Error handling is done in the hook
            console.error(error);
        }
    };

    return (
        <DeleteDialog
            open={true}
            onOpenChange={(open) => !open && onCancel()}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            itemName="rekening"
        />
    );
}