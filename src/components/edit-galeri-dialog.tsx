"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGaleriCrud } from "@/hooks/use-galeri-crud";
import { GaleriForm } from "@/components/galeri-form";
import { Galeri } from "@/lib/schema";
import { useState } from "react";

interface EditGaleriDialogProps {
  galeri: Galeri;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditGaleriDialog({
  galeri,
  onSuccess,
  onCancel,
}: EditGaleriDialogProps) {
  const [open, setOpen] = useState(true);
  const { editGaleri } = useGaleriCrud();

  const handleSubmit = async (formData: FormData) => {
    await editGaleri(galeri.id, formData);
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
          <DialogTitle>Edit Galeri</DialogTitle>
        </DialogHeader>
        <GaleriForm
          galeri={galeri}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
