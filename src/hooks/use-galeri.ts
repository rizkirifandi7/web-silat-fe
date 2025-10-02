"use client";
import { getGaleri } from "@/lib/galeri-api";
import { useQuery } from "@tanstack/react-query";

export interface Galeri {
	id: number;
	gambar: string;
	judul: string;
	deskripsi: string;
	createdAt: string;
	updatedAt: string;
}

export function useGaleri() {
	return useQuery<Galeri[], Error>({
		queryKey: ["galeri"],
		queryFn: getGaleri,
	});
}
