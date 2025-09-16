"use client";

import { KartuAnggota } from "@/components/kartu-anggota";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Anggota } from "@/lib/schema";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 8;

export default function Page() {
	const [data, setData] = useState<Anggota[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [tingkatanFilter, setTingkatanFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		async function getData() {
			try {
				setLoading(true);
				const res = await fetch("http://localhost:8015/anggota", {
					cache: "no-store",
				});
				if (!res.ok) {
					throw new Error("Failed to fetch data");
				}
				const fetchedData = await res.json();
				setData(fetchedData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
		getData();
	}, []);

	const filteredData = useMemo(() => {
		setCurrentPage(1); // Reset to first page on filter change
		return data.filter((anggota) => {
			const matchesSearch = anggota.nama_lengkap
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesTingkatan =
				tingkatanFilter === "all" ||
				anggota.tingkatan_sabuk === tingkatanFilter;
			const matchesStatus =
				statusFilter === "all" || anggota.status_keanggotaan === statusFilter;
			return matchesSearch && matchesTingkatan && matchesStatus;
		});
	}, [data, searchTerm, tingkatanFilter, statusFilter]);

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredData.slice(startIndex, endIndex);
	}, [filteredData, currentPage]);

	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const uniqueTingkatan = useMemo(() => {
		const tingkatan = new Set(data.map((a) => a.tingkatan_sabuk));
		return Array.from(tingkatan);
	}, [data]);

	const uniqueStatus = useMemo(() => {
		const status = new Set(data.map((a) => a.status_keanggotaan));
		return Array.from(status);
	}, [data]);

	return (
		<div className="space-y-4 p-4 md:p-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-bold">Cetak Kartu Anggota</h1>
					<p className="text-muted-foreground">
						Filter dan temukan kartu anggota yang ingin Anda cetak.
					</p>
				</div>
			</div>

			<Card className="grid grid-cols-1 gap-4 md:grid-cols-3 p-4">
				<Input
					placeholder="Cari nama anggota..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Select value={tingkatanFilter} onValueChange={setTingkatanFilter}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Filter berdasarkan tingkatan" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua Tingkatan</SelectItem>
						{uniqueTingkatan.map((tingkatan) => (
							<SelectItem key={tingkatan} value={tingkatan}>
								{tingkatan}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Filter berdasarkan status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua Status</SelectItem>
						{uniqueStatus.map((status) => (
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Card>

			{loading ? (
				<p>Memuat data...</p>
			) : (
				<>
					<Card className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
						{paginatedData.length > 0 ? (
							paginatedData.map((anggota) => (
								<KartuAnggota key={anggota.id} anggota={anggota} />
							))
						) : (
							<p className="col-span-full text-center text-muted-foreground">
								Tidak ada anggota yang cocok dengan filter.
							</p>
						)}
					</Card>
					{totalPages > 1 && (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault();
											handlePageChange(currentPage - 1);
										}}
										className={
											currentPage === 1
												? "pointer-events-none text-muted-foreground"
												: ""
										}
									/>
								</PaginationItem>
								{[...Array(totalPages)].map((_, i) => (
									<PaginationItem key={i}>
										<PaginationLink
											href="#"
											onClick={(e) => {
												e.preventDefault();
												handlePageChange(i + 1);
											}}
											isActive={currentPage === i + 1}
										>
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											handlePageChange(currentPage + 1);
										}}
										className={
											currentPage === totalPages
												? "pointer-events-none text-muted-foreground"
												: ""
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</div>
	);
}
