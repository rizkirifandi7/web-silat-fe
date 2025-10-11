import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard Anggota",
	description: "Halaman dashboard untuk anggota.",
};

export default function DashboardAnggotaPage() {
	return (
		<div className="h-full w-full">
			<h1 className="text-2xl font-bold">Dashboard Anggota</h1>
			<p>Selamat datang di dashboard anggota.</p>
		</div>
	);
}
