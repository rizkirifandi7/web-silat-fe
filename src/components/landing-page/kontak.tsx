"use client";

import React, {useRef} from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const Kontak = () => {
	const form = useRef<HTMLFormElement>(null);
	
		const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
	
			if (!form.current) return;
	
			emailjs
				.sendForm("service_pusamada", "template_hzw6te4", form.current, {
					publicKey: "mzBQjN8b5UKxMGE28",
				})
				.then(
					() => {
						console.log("SUCCESS!");
						toast("Pesan berhasil dikirim!");
						form.current?.reset();
					},
					(error) => {
						console.log("FAILED...", error.text);
						toast("Gagal mengirim pesan. Silakan coba lagi.");
					}
				);
		};
	return (
		
		<section className="w-full py-16 md:py-24 bg-background overflow-hidden">
			<div className="container mx-auto max-w-6xl gap-8 px-4 sm:px-6 lg:px-8 text-center">
				<div className={`space-y-3 animate-fade-in-up mb-8 md:mb-12`}>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
						Hubungi Kami
					</h2>
					<p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
						Punya pertanyaan atau ingin bergabung? Jangan ragu untuk menghubungi
						kami.
					</p>
				</div>
				<div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 mt-8">
					<div
						className={`space-y-6 animate-slide-in-from-left`}
						style={{ animationDelay: "0.2s" }}
					>
						<Card className="h-full shadow-none">
							<CardHeader>
								<CardTitle className="text-xl sm:text-2xl">
									Informasi Kontak
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 text-left">
								<div className="flex items-start space-x-4">
									<MapPin className="mt-1 h-6 w-6 text-primary" />
									<div>
										<p className="font-semibold">Alamat</p>
										<span className="text-muted-foreground text-sm sm:text-base">
											Kampung Sukarasa, Arjasari, Kab. Bandung
										</span>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<Phone className="mt-1 h-6 w-6 text-primary" />
									<div>
										<p className="font-semibold">Telepon</p>
										<span className="text-muted-foreground text-sm sm:text-base">
											(+62) 823-4393-6639
										</span>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<Mail className="mt-1 h-6 w-6 text-primary" />
									<div>
										<p className="font-semibold">Email</p>
										<span className="text-muted-foreground text-sm sm:text-base">
											kontak@pusamadaind.com
										</span>
									</div>
								</div>
								<div className="mt-8 h-48 sm:h-64 bg-muted rounded-lg overflow-hidden">
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
							</CardContent>
						</Card>
					</div>
					<div
						className={`space-y-6 animate-slide-in-from-right`}
						style={{ animationDelay: "0.4s" }}
					>
						<Card className="h-fit shadow-none">
							<CardHeader>
								<CardTitle className="text-xl sm:text-2xl">
									Kirim Pesan
								</CardTitle>
							</CardHeader>
							<CardContent>
								<form className="space-y-4" ref={form} onSubmit={sendEmail}>
									<div className="space-y-2 text-left">
										<Label htmlFor="nama">Nama</Label>
										<Input id="nama" name="from_name" placeholder="John" />
									</div>
									<div className="space-y-2 text-left">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											name="from_email"
											type="email"
											placeholder="johndoe@example.com"
										/>
									</div>
									<div className="space-y-2 text-left">
										<Label htmlFor="message">Pesan</Label>
										<Textarea
											id="message"
											name="message"
											placeholder="Tulis pesan Anda di sini..."
											className="min-h-[120px]"
										/>
									</div>
									<Button type="submit" className="w-full">
										Kirim Pesan
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Kontak;
