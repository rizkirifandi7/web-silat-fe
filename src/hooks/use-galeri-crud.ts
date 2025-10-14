"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGaleri,
  deleteGaleri,
  getGaleri,
  updateGaleri,
} from "@/lib/galeri-api";
import { Galeri } from "@/lib/schema";
import { toast } from "sonner";

export function useGaleriCrud() {
  const queryClient = useQueryClient();

  const {
    data: galeri,
    isLoading: loading,
    isError,
	refetch: refreshGaleri,
  } = useQuery({
    queryKey: ["galeri"],
    queryFn: getGaleri,
  });

  const {
    mutate: addGaleri,
    mutateAsync: addGaleriAsync,
    isPending: isAdding,
  } = useMutation<Galeri, Error, FormData>({
    mutationFn: createGaleri,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeri"] });
      toast.success("Galeri berhasil ditambahkan.");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan galeri.");
    },
  });

  const { mutate: editGaleri, isPending: isEditing } = useMutation<
    Galeri,
    Error,
    { id: number; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateGaleri(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeri"] });
      toast.success("Galeri berhasil diperbarui.");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui galeri.");
    },
  });

  const { mutate: removeGaleri, isPending: isDeleting } = useMutation<
    void,
    Error,
    number
  >({
    mutationFn: deleteGaleri,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeri"] });
      toast.success("Galeri berhasil dihapus.");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus galeri.");
    },
  });

  return {
    galeri,
    loading,
    isError,
    addGaleri,
    addGaleriAsync,
    isAdding,
    editGaleri,
    isEditing,
    removeGaleri,
    isDeleting,
    refreshGaleri,
  };
}
