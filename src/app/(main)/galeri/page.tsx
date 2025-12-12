import { GaleriGrid } from "@/components/galeri-grid";
import { getGaleri } from "@/lib/galeri-api";

export default async function GaleriPage() {
	const galleryData = await getGaleri();

	return (
		<section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tighter sm:text-4xl">
							Galeri Kegiatan
						</h1>
						<p className="max-w-[900px] text-muted-foreground text-sm md:text-base/relaxed">
							Momen-momen terbaik dari kegiatan kami, tertangkap dalam gambar.
						</p>
					</div>
				</div>
				{galleryData.length > 0 ? (
					<GaleriGrid galleryData={galleryData} />
				) : (
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-muted-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-foreground mb-2">
							Belum Ada Galeri
						</h3>
						<p className="text-muted-foreground">
							Galeri kegiatan akan segera ditampilkan di sini.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}

