"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RekeningForm } from "@/components/rekening-form";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRekeningCrud } from "@/hooks/use-rekening-crud";

export function TambahRekeningDialog() {
  const [open, setOpen] = useState(false);
  const { addRekeningAsync } = useRekeningCrud();

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleSubmit = async (formData: FormData) => {
    await addRekeningAsync(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span>Tambah Rekening</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Rekening</DialogTitle>
        </DialogHeader>
        <RekeningForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
