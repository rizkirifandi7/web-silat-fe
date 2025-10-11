"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Anggota } from "@/lib/schema";

const fetchAnggota = async (): Promise<Anggota[]> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anggota`, {
		cache: "no-store",
	});
	if (!res.ok) {
		throw new Error("Gagal mengambil data anggota");
	}
	const data: Anggota[] = await res.json();
	// Filter hanya untuk peran "anggota" di sisi klien
	return data;
};

export function useAnggotaData() {
	const [searchTerm, setSearchTerm] = useState("");
	const [tingkatanFilter, setTingkatanFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data: anggotaData = [],
		isLoading,
		error,
	} = useQuery<Anggota[]>({
		queryKey: ["anggota"],
		queryFn: fetchAnggota,
	});

	// Reset halaman ke 1 setiap kali filter berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, tingkatanFilter, statusFilter]);

	const filteredData = useMemo(() => {
		return anggotaData.filter((anggota) => {
			const matchesSearch = anggota.nama
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesTingkatan =
				tingkatanFilter === "all" ||
				anggota.tingkatan_sabuk === tingkatanFilter;
			const matchesStatus =
				statusFilter === "all" || anggota.status_keanggotaan === statusFilter;
			return matchesSearch && matchesTingkatan && matchesStatus;
		});
	}, [anggotaData, searchTerm, tingkatanFilter, statusFilter]);

	const uniqueTingkatan = useMemo(() => {
		const tingkatan = new Set(anggotaData.map((a) => a.tingkatan_sabuk));
		return Array.from(tingkatan);
	}, [anggotaData]);

	const uniqueStatus = useMemo(() => {
		const status = new Set(anggotaData.map((a) => a.status_keanggotaan));
		return Array.from(status);
	}, [anggotaData]);

	return {
		// State
		searchTerm,
		setSearchTerm,
		tingkatanFilter,
		setTingkatanFilter,
		statusFilter,
		setStatusFilter,
		currentPage,
		setCurrentPage,
		// Derived data
		filteredData,
		uniqueTingkatan,
		uniqueStatus,
		// React Query status
		isLoading,
		error,
	};
}
