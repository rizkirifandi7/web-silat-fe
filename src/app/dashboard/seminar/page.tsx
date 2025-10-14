"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataTableSeminar } from "@/components/data-table-seminar";
import { useSeminarCrud } from "@/hooks/use-seminar-crud";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const queryClient = new QueryClient();

function SeminarPageContent() {
	const { data, isLoading, error } = useSeminarCrud();

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Manajemen Seminar</h2>
				<div className="flex items-center space-x-2">
					<Link href="/dashboard/seminar/tambah">
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" />
							Tambah Seminar
						</Button>
					</Link>
				</div>
			</div>

			<Card className="shadow-none rounded-lg">
				<CardHeader>
					<CardTitle>Daftar Seminar</CardTitle>
					<CardDescription>
						Berikut adalah daftar semua seminar yang terdaftar. Kelola seminar
						dengan mudah.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<p className="text-gray-500">Memuat data seminar...</p>
						</div>
					) : error ? (
						<div className="flex justify-center items-center h-64">
							<p className="text-red-500">
								Terjadi kesalahan saat memuat data.
							</p>
						</div>
					) : (
						<DataTableSeminar data={data || []} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default function SeminarPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<SeminarPageContent />
		</QueryClientProvider>
	);
}
