import Image from "next/image";
import React from "react";
import CarouselGaleri from "../carousel-galeri";
import { dataCarousel } from "@/lib/dataLandingPage";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { MapPin, Phone } from "lucide-react";
import { Card } from "../ui/card";


const Body = () => {
  return (
    <div className="w-full bg-background mb-16">
        <div className="container mx-auto max-w-5xl">
            <h2 className="mb-10 text-4xl font-bold text-foreground mt-6 text-center">Tentang</h2>
            <div className="justify-center item-center flex flex-col-reverse md:flex-row px-4 gap-6">
                <div className="w-full">
                    <h3 className="mb-2 text-lg text-muted-foreground text-justify">
                        Didirikan oleh murid-murid langsung para maestro silat terdahulu,
                        PUSAMADA berpegang pada ajaran luhur para guru agar ilmu dan
                        kebijaksanaan yang diwariskan tidak lekang oleh waktu. Berawal dari
                        kelompok latihan sederhana, PUSAMADA berkembang menjadi organisasi
                        terstruktur dengan fokus tidak hanya pada penguasaan teknik bela
                        diri, tetapi juga pada pembentukan karakter, peneguhan disiplin,
                        serta penanaman rasa cinta tanah air yang mendalam bagi setiap
                        anggotanya.
                    </h3>
                    
                </div> 
                <div className="md:w-1/2 w-full flex justify-center items-center px-6">
                    <Image
                        src="/silat.png"
                        alt="Sejarah Pusamada"
                        width={350}
                        height={300}
                        className="rounded-lg shadow-lg"
                    />

                </div>
            </div>


            <div className="max-w-5xl mt-30 mx-auto px-4">
                <h2 className="mb-10 text-4xl font-bold text-foreground text-center">Kegiatan Kami</h2>
                <CarouselGaleri  data={dataCarousel} />
            </div>

            <div className="max-w-5xl mx-auto mt-25 px-4">
                <h2 className="mb-10 text-4xl font-bold text-foreground text-center">Informasi Kontak</h2>
                <Card className="max-w-5xl mx-auto bg-transparent border-none shadow-none">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						{/* Kolom Informasi Kontak */}
						<div className="flex flex-col justify-between">
							<div>
								<p className="text-muted-foreground text-justify mb-8">
									Anda juga bisa mengunjungi kami langsung di alamat berikut
									atau menghubungi kami melalui telepon dan email.
								</p>
								<div className="space-y-6">
									<div className="flex items-start">
										<MapPin className="w-5 h-5 text-primary mr-4 mt-1 flex-shrink-0" />
										<span className="text-foreground">
											Kampung Sukarasa Arjasari Kab. Bandung
										</span>
									</div>
									<div className="flex items-center">
										<Phone className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
										<span className="text-foreground">(+62) 823-4393-6639</span>
									</div>
								</div>
							</div>
							{/* Placeholder untuk Peta atau Gambar */}
							<div className="mt-8 h-48 bg-muted rounded-lg">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9!2d107.6419995!3d-7.0504958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68eb006b602577%3A0x22f5ce8d2a912d4!2sPerguruan%20Pencak%20Silat%20PUSAMADA!5e0!3m2!1sen!2sid!4v1695480000000!5m2!1sen!2sid"
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-lg"
								></iframe>
							</div>
						</div>

						{/* Kolom Form Kontak */}
						<form className="space-y-6">
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="name">Nama Lengkap</Label>
								<Input
									type="text"
									id="name"
									placeholder="Masukkan nama lengkap Anda"
								/>
							</div>
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="email">Alamat Email</Label>
								<Input type="email" id="email" placeholder="contoh@email.com" />
							</div>
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="message">Pesan Anda</Label>
								<Textarea
									id="message"
									placeholder="Tuliskan pesan Anda di sini..."
									rows={6}
								/>
							</div>
							<div>
								<Button type="submit" className="w-full">
									Kirim Pesan
								</Button>
							</div>
						</form>
					</div>
				</Card>
            
            </div>

			<div>

			</div>
        </div>

    </div>
  );
};

export default Body;
