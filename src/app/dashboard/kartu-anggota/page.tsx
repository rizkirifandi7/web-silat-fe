"use client";

import { useMemo } from "react";
import { KartuAnggota } from "@/components/kartu-anggota";
import {
	FilterSkeleton,
	KartuAnggotaSkeleton,
} from "@/components/kartu-anggota-skeleton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAnggotaData } from "@/hooks/use-anggota-data";
import { AlertTriangle, SearchX } from "lucide-react";
import { Anggota } from "@/lib/schema";

const ITEMS_PER_PAGE = 12; // Increased items per page for better layout

function AnggotaFilter({
	searchTerm,
	setSearchTerm,
	tingkatanFilter,
	setTingkatanFilter,
	statusFilter,
	setStatusFilter,
	uniqueTingkatan,
	uniqueStatus,
	isLoading,
}: {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	tingkatanFilter: string;
	setTingkatanFilter: (value: string) => void;
	statusFilter: string;
	setStatusFilter: (value: string) => void;
	uniqueTingkatan: string[];
	uniqueStatus: string[];
	isLoading: boolean;
}) {
	if (isLoading) {
		return <FilterSkeleton />;
	}

	return (
		<Card className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 shadow-none">
			<Input
				placeholder="Cari nama anggota..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				disabled={isLoading}
			/>
			<Select
				value={tingkatanFilter}
				onValueChange={setTingkatanFilter}
				disabled={isLoading}
			>
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
			<Select
				value={statusFilter}
				onValueChange={setStatusFilter}
				disabled={isLoading}
			>
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
	);
}

function AnggotaGrid({
	filteredData,
	isLoading,
	error,
	currentPage,
}: {
	filteredData: Anggota[];
	isLoading: boolean;
	error: Error | null;
	currentPage: number;
}) {
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	}, [filteredData, currentPage]);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
				{Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
					<KartuAnggotaSkeleton key={index} />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 text-center h-64">
				<AlertTriangle className="w-12 h-12 text-destructive" />
				<h2 className="text-xl font-semibold">Gagal Memuat Data</h2>
				<p className="text-muted-foreground">
					Terjadi kesalahan saat mengambil data anggota. Silakan coba lagi
					nanti.
				</p>
			</div>
		);
	}

	if (paginatedData.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 text-center h-64">
				<SearchX className="w-12 h-12 text-muted-foreground" />
				<h2 className="text-xl font-semibold">Anggota Tidak Ditemukan</h2>
				<p className="text-muted-foreground">
					Tidak ada anggota yang cocok dengan kriteria filter Anda.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
			{paginatedData.map((anggota) => (
				<KartuAnggota key={anggota.id} anggota={anggota} />
			))}
		</div>
	);
}

function AnggotaPagination({
	filteredData,
	currentPage,
	setCurrentPage,
	isLoading,
}: {
	filteredData: Anggota[];
	currentPage: number;
	setCurrentPage: (page: number) => void;
	isLoading: boolean;
}) {
	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	if (isLoading || totalPages <= 1) {
		return null;
	}

	return (
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
							currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
							currentPage === totalPages ? "pointer-events-none opacity-50" : ""
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

export default function Page() {
	const {
		searchTerm,
		setSearchTerm,
		tingkatanFilter,
		setTingkatanFilter,
		statusFilter,
		setStatusFilter,
		currentPage,
		setCurrentPage,
		filteredData,
		uniqueTingkatan,
		uniqueStatus,
		isLoading,
		error,
	} = useAnggotaData();

	return (
		<div className="space-y-6 p-4 md:p-6">
			<header>
				<h1 className="text-3xl font-bold tracking-tight">
					Cetak Kartu Anggota
				</h1>
				<p className="text-muted-foreground">
					Filter dan temukan kartu anggota yang ingin Anda cetak.
				</p>
			</header>

			<AnggotaFilter
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				tingkatanFilter={tingkatanFilter}
				setTingkatanFilter={setTingkatanFilter}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				uniqueTingkatan={uniqueTingkatan}
				uniqueStatus={uniqueStatus}
				isLoading={isLoading}
			/>
			<AnggotaGrid
				filteredData={filteredData}
				isLoading={isLoading}
				error={error}
				currentPage={currentPage}
			/>
			<AnggotaPagination
				filteredData={filteredData}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				isLoading={isLoading}
			/>
		</div>
	);
}
