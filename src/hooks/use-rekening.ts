"use client";

import { getRekening } from "@/lib/rekening-api";
import { useQuery } from "@tanstack/react-query";

export interface Rekening {
  id: number;
  logo: string;
  namaBank: string;
  noRekening: string;
  createdAt: string;
  updatedAt: string;
}

export function useRekening() {
    return useQuery<Rekening[], Error>({
        queryKey: ["rekening"],
        queryFn: getRekening,
    });
}

