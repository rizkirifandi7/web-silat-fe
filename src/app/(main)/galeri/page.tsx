import { GaleriGrid } from "@/components/galeri-grid";
import { getGaleri } from "@/lib/galeri-api";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
	const galleryData = await getGaleri();

	return (
		<section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Galeri Kegiatan
						</h1>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Momen-momen terbaik dari kegiatan kami, tertangkap dalam gambar.
						</p>
					</div>
				</div>
				{galleryData.length > 0 ? (
					<GaleriGrid galleryData={galleryData} />
				) : (
					<div className="text-center py-10">
						<p className="text-lg text-muted-foreground">
							Gagal memuat galeri atau tidak ada gambar yang tersedia saat ini.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
