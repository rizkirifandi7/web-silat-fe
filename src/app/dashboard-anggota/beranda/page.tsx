import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBook } from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard Anggota",
	description: "Halaman dashboard untuk anggota.",
};

export default function DashboardAnggotaPage() {
	return (
		<div className="h-full w-full">
			<h1 className="text-2xl font-bold">Dashboard</h1>

			<div className="grid grid-cols-3 gap-2 mt-4">
				<Card className="@container/card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardDescription>Total Materi</CardDescription>
						<IconBook className="h-6 w-6 text-blue-500" />
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						2
					</CardTitle>
				</CardHeader>
			</Card>

				<Card>
					<h1>test</h1>
				</Card>
				<Card>
					<h1>Test</h1>
				</Card>
			</div>
		</div>
	);
}
