import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-gray-900">404</h1>
				<p className="mt-4 text-xl text-gray-600">Halaman tidak ditemukan</p>
				<p className="mt-2 text-gray-500">
					Maaf, halaman yang Anda cari tidak ada.
				</p>
				<div className="mt-6">
					<Link href="/">
						<Button>Kembali ke Beranda</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
