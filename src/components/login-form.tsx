/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useUserContext } from "@/context/user-context";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { login } = useUserContext();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		toast.loading("Mencoba masuk...");

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Email atau password salah.");
			}

			// Destructuring data sesuai dengan struktur backend baru
			const { token, user } = result.data;

			// Panggil fungsi login dari context
			login(token, user);

			toast.dismiss();
			toast.success(`Selamat datang kembali, ${user.nama}!`);
		} catch (error: any) {
			toast.dismiss();
			toast.error(error.message || "Terjadi kesalahan saat login.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<a
							href="#"
							className="flex flex-col items-center gap-2 font-medium"
						>
							<div className="flex size-8 items-center justify-center rounded-md">
								<Image
									src="/pusamada-logo.png"
									alt="PUSAMADA"
									width={40}
									height={40}
								/>
							</div>
						</a>
						<h1 className="text-xl font-bold">Selamat Datang</h1>
						<div className="text-center text-sm">
							Masuk ke akun Anda untuk melanjutkan
						</div>
					</div>

					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								onChange={(e) => setEmail(e.target.value)}
								disabled={isSubmitting}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								onChange={(e) => setPassword(e.target.value)}
								disabled={isSubmitting}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Memproses..." : "Masuk"}
							{isSubmitting && (
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							)}
						</Button>
					</div>
				</div>
			</form>
			<Link
				href="/"
				className="inline-flex items-center gap-0.5 text-sm text-muted-foreground hover:underline"
			>
				<ArrowLeft size={14} /> Kembali ke Beranda
			</Link>
		</div>
	);
}

