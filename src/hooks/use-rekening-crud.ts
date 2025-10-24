"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRekening,
  deleteRekening,
  getRekening,
  updateRekening,
} from "@/lib/rekening-api";
import { Rekening } from "@/lib/schema";
import { toast } from "sonner";

export function useRekeningCrud() {
  const queryClient = useQueryClient();

  const {
    data: rekening,
    isLoading: loading,
    isError,
    refetch: refreshRekening,
  } = useQuery({
    queryKey: ["rekening"],
    queryFn: getRekening,
  });
  
  const {
    mutate: addRekening,
    mutateAsync: addRekeningAsync,
    isPending: isAdding,
    } = useMutation<Rekening, Error, FormData>({
        mutationFn: createRekening,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rekening"] });
            toast.success("Rekening berhasil ditambahkan.");
        },
        onError: (error) => {
            toast.error(error.message || "Gagal menambahkan rekening.");
        },
    });

    const { mutate: editRekening, isPending: isEditing } = useMutation<
        Rekening,
        Error,
        { id: number; data: FormData }
    >({
        mutationFn: ({ id, data }) => updateRekening(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rekening"] });
            toast.success("Rekening berhasil diperbarui.");
        },
        onError: (error) => {
            toast.error(error.message || "Gagal memperbarui rekening.");
        },
    });

    const { mutate: removeRekening, isPending: isDeleting } = useMutation<
        void,
        Error,
        number
    >({
        mutationFn: deleteRekening,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rekening"] });
            toast.success("Rekening berhasil dihapus.");
        },
        onError: (error) => {
            toast.error(error.message || "Gagal menghapus rekening.");
        },
    });

    return {
        rekening,
        loading,
        isError,
        refreshRekening,
        addRekening,
        addRekeningAsync,
        isAdding,
        editRekening,
        isEditing,
        removeRekening,
        isDeleting,
    };
}