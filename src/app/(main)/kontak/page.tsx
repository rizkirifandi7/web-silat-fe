import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PageKontak = () => {
	return (
		<div className="w-full min-h-dvh bg-background">
			<div className="container mx-auto px-4 py-16 md:py-24">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
						Hubungi Kami
					</h1>
					<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
						Punya pertanyaan atau ingin bergabung? Jangan ragu untuk mengirim
						pesan kepada kami.
					</p>
				</div>

				{/* Konten Utama */}
				<Card className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12">
						{/* Kolom Informasi Kontak */}
						<div className="flex flex-col justify-between">
							<div>
								<h2 className="text-2xl font-semibold mb-2">
									Informasi Kontak
								</h2>
								<p className="text-muted-foreground mb-8">
									Anda juga bisa mengunjungi kami langsung di alamat berikut
									atau menghubungi kami melalui telepon dan email.
								</p>
								<div className="space-y-6">
									<div className="flex items-start">
										<MapPin className="w-5 h-5 text-primary mr-4 mt-1 flex-shrink-0" />
										<span className="text-foreground">
											Jl. Padepokan Pencak Silat, No. 1, Jakarta Timur,
											Indonesia
										</span>
									</div>
									<div className="flex items-center">
										<Phone className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
										<span className="text-foreground">(021) 123-4567</span>
									</div>
									<div className="flex items-center">
										<Mail className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
										<span className="text-foreground">
											info@pencaksilatindonesia.com
										</span>
									</div>
								</div>
							</div>
							{/* Placeholder untuk Peta atau Gambar */}
							<div className="mt-8 h-48 bg-muted rounded-lg hidden md:block">
								{/* Anda bisa menaruh komponen peta di sini */}
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
									rows={5}
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
		</div>
	);
};

export default PageKontak;
