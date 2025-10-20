import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getAnggotas } from "@/lib/anggota-api";

export async function RecentAnggota() {
	const data = await getAnggotas();

	const recentAnggota = data
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
		.slice(0, 5);

	return (
		<Card className="shadow-none">
			<CardHeader>
				<CardTitle>Anggota Baru</CardTitle>
				<CardDescription>
					Berikut adalah anggota yang baru saja bergabung.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{recentAnggota.map((anggota) => (
						<div
							className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
							key={anggota.id}
						>
							<div className="flex items-center">
								<Avatar className="h-10 w-10 sm:h-9 sm:w-9">
									<AvatarImage src={anggota.foto} alt={`Avatar ${anggota.nama}`} />
									<AvatarFallback className="text-sm font-medium">
										{anggota.nama.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="ml-3 sm:ml-4 min-w-0">
									<p className="text-sm font-medium leading-none truncate">
										{anggota.nama}
									</p>
									<p className="text-sm text-muted-foreground truncate">
										{anggota.email}
									</p>
								</div>
							</div>

							<div className="mt-1 sm:mt-0 sm:ml-auto text-sm text-muted-foreground">
								{new Date(anggota.createdAt).toLocaleDateString("id-ID")}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
