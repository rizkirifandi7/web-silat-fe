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
		<Card>
			<CardHeader>
				<CardTitle>Anggota Baru</CardTitle>
				<CardDescription>
					Berikut adalah anggota yang baru saja bergabung.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{recentAnggota.map((anggota) => (
						<div className="flex items-center" key={anggota.id}>
							<Avatar className="h-9 w-9">
								<AvatarImage src={anggota.foto} alt="Avatar" />
								<AvatarFallback>{anggota.nama.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="ml-4 space-y-1">
								<p className="text-sm font-medium leading-none">
									{anggota.nama}
								</p>
								<p className="text-sm text-muted-foreground">{anggota.email}</p>
							</div>
							<div className="ml-auto font-medium">
								{new Date(anggota.createdAt).toLocaleDateString()}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
