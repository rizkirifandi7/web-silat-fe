import CarouselGaleri from "@/components/carousel-galeri";
import LandingPage from "@/components/landing-page/landing-page";
import { Button } from "@/components/ui/button";
import { dataCarousel } from "@/lib/dataLandingPage";
import Image from "next/image";
import Link from "next/link";

export default function PageHome() {
	return (
		<div className="bg-background">
			<LandingPage />

			<section className="mx-auto max-w-5xl h-dvh w-full px-4">
				<div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-2 lg:grid-cols-2">
				<div className="flex justify-center items-center">
					<Image
						src="/silat.jpg"
						alt="PUSAMADA"
						width={400}
						height={400}
						priority
						className="rounded-lg"
					/>
					
				</div>

				<div className="">
					<h1 className=" mt-2 text-xl text-start font-extrabold tracking-tight text-foreground md:text-3xl">
						Tentang
					</h1>
					<p className="mt-4 text-md text-justify text-muted-foreground">
						Pusaka Mande Muda Indonesia didirikan pada tanggal 27 Juni 1966 di
						Bandung, Jawa Barat oleh Almarhum H. Oom Somantri, SH. Beliau adalah
						seorang tokoh penting dalam pengembangan seni bela diri Pencak Silat
						di Indonesia.
					</p>
					<Link className="flex justify-start" href="/tentang">
						<Button
						size="lg"
						variant="outline"
						className="w-full sm:w-auto  cursor-pointer mt-5"
					>
						Baca Selengkapnya
					</Button>
					</Link>
				</div>
				</div>
		
				<div className="mt-10 justify-center items-center">
					<h1 className=" mt-2 text-xl font-extrabold text-center tracking-tight text-foreground md:text-3xl">
						Galeri
					</h1>
					<div className="mt-5 flex justify-center items-center">
						<CarouselGaleri banner={dataCarousel} size={"cover"} />
					</div>
				</div>


				{/* <div className="mt-10">
					<h1 className=" mt-2 text-xl font-extrabold tracking-tight text-foreground md:text-3xl">
						Kontak Kami
					</h1>

					<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 mt-5">
						<div className="space-y-4">
							<p className="text-md text-muted-foreground">
								Alamat: Jl. Pusaka No. 123, Bandung, Jawa Barat, Indonesia
							</p>
							<p className="text-md text-muted-foreground">
								Telepon: +62 22 1234567
							</p>
							<p className="text-md text-muted-foreground">
								Email: info@pusakamandemuda.id
							</p>
						</div>

						<div className="flex justify-end">
							<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d9096.732686972857!2d107.68930634081755!3d-6.984795495909518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1758809535104!5m2!1sen!2sid" width="250" height="200" ></iframe>
						</div>
					</div>

				</div> */}
			</section>
		</div>
	);
}
