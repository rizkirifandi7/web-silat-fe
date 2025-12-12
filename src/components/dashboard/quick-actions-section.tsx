import {
	IconUserPlus,
	IconBook,
	IconPhoto,
	IconUsers,
	IconSettings,
	IconCashBanknote,
} from "@tabler/icons-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const quickActions = [
	{
		title: "Tambah Anggota",
		description: "Daftarkan anggota baru",
		icon: IconUserPlus,
		href: "/dashboard/anggota",
		color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
	},
	{
		title: "Kelola Materi",
		description: "Upload materi pembelajaran",
		icon: IconBook,
		href: "/dashboard/materi",
		color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
	},
	{
		title: "Galeri Foto",
		description: "Tambahkan foto kegiatan",
		icon: IconPhoto,
		href: "/dashboard/galeri",
		color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
	},
	{
		title: "Kelola Donasi",
		description: "Monitor kampanye donasi",
		icon: IconCashBanknote,
		href: "/dashboard/donasi",
		color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
	},
	{
		title: "Lihat Semua Anggota",
		description: "Kelola data anggota",
		icon: IconUsers,
		href: "/dashboard/anggota",
		color: "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20",
	},
	{
		title: "Pengaturan",
		description: "Konfigurasi sistem",
		icon: IconSettings,
		href: "/dashboard/profile",
		color: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
	},
];

export function QuickActionsSection() {
	return (
		<Card className="shadow-none">
			<CardHeader>
				<CardTitle>Aksi Cepat</CardTitle>
				<CardDescription>
					Akses cepat ke fitur-fitur yang sering digunakan
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
					{quickActions.map((action) => {
						const Icon = action.icon;
						return (
							<Link key={action.title} href={action.href}>
								<Button
									variant="outline"
									className="h-auto w-full flex-col items-center justify-center gap-2 p-4 hover:shadow-md transition-all"
								>
									<div className={`rounded-lg p-2 ${action.color}`}>
										<Icon className="h-5 w-5" />
									</div>
									<div className="text-center">
										<div className="font-semibold text-xs">{action.title}</div>
										<div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
											{action.description}
										</div>
									</div>
								</Button>
							</Link>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
