"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRekeningCrud } from "@/hooks/use-rekening-crud";
import { RekeningForm } from "@/components/rekening-form";
import { Rekening } from "@/lib/schema";
import { useState } from "react";

interface EditRekeningDialogProps {
  rekening: Rekening;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditRekeningDialog({
  rekening,
  onSuccess,
  onCancel,
}: EditRekeningDialogProps) {
  const [open, setOpen] = useState(true);
  const { editRekening } = useRekeningCrud();

  const handleSubmit = async (formData: FormData) => {
    await editRekening({ id: rekening.id, data: formData });
  };

  const handleSuccess = () => {
    onSuccess();
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Rekening</DialogTitle>
        </DialogHeader>
        <RekeningForm
          rekening={rekening}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
