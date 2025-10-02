import Galeri from "@/components/landing-page/galeri";
import Hero from "@/components/landing-page/hero";
import Kontak from "@/components/landing-page/kontak";
import Tentang from "@/components/landing-page/tentang";

export default function PageHome() {
	return (
		<div className="bg-background">
			<Hero />
			<Tentang />
			<Galeri />
			<Kontak />
		</div>
	);
}
