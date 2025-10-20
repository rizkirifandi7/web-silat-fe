"use client";

import { Seminar } from "@/lib/schema";
import { createSeminar, deleteSeminar, getSeminars, updateSeminar, getSeminarById } from "@/lib/seminar-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSeminarCrud() {
  const queryClient = useQueryClient();

  const {
    data: seminar,
    isLoading: loading,
    isError,
    refetch: refreshSeminar,
  } = useQuery({
    queryKey: ["seminar"],
    queryFn: getSeminars,
  });

  const {
    mutate: addSeminar,
    mutateAsync: addSeminarAsync,
    isPending: isAdding,
  } = useMutation<Seminar, Error, FormData>({
    mutationFn: createSeminar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar"] });
      toast.success("Seminar berhasil ditambahkan.");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan seminar.");
    },
  });

  const { mutate: editSeminar, isPending: isEditing } = useMutation<
    Seminar,
    Error,
    { id: number; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateSeminar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar"] });
      toast.success("Seminar berhasil diperbarui.");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui seminar.");
    },
  });

  const { mutate: removeSeminar, isPending: isDeleting } = useMutation<
    void,
    Error,
    number
  >({
    mutationFn: deleteSeminar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar"] });
      toast.success("Seminar berhasil dihapus.");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus seminar.");
    },
  });

  return {
    seminar,
    loading,
    isError,
    addSeminar,
    addSeminarAsync,
    isAdding,
    editSeminar,
    isEditing,
    removeSeminar,
    isDeleting,
    refreshSeminar,
    useSeminarById,
  };
}

// Hook untuk mengambil seminar berdasarkan ID
import { useQuery as useQueryBase } from "@tanstack/react-query";
export function useSeminarById(id: number) {
  return useQueryBase<Seminar, Error>({
    queryKey: ["seminar", id],
    queryFn: () => getSeminarById(id),
    enabled: !!id,
  });
}
