/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Image from "next/image";
import { ArrowLeft, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { loginSchema, type LoginData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [isRedirecting, setIsRedirecting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginData) => {
		setServerError(null);

		try {
			const res = await fetch("http://localhost:8015/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.message || "Login gagal");
			}

			if (result && result.token) {
				Cookies.set("token", result.token, { expires: 7, path: "/" });
				setIsRedirecting(true);
				toast.success("Login berhasil!");
				router.push("/dashboard/beranda");
			} else {
				throw new Error("Token tidak diterima dari server");
			}
		} catch (err: any) {
			setServerError(err.message);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
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
					{serverError && (
						<Alert variant="destructive">
							<Terminal className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{serverError}</AlertDescription>
						</Alert>
					)}
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								{...register("email")}
								disabled={isSubmitting || isRedirecting}
							/>
							{errors.email && (
								<p className="text-sm text-red-500">{errors.email.message}</p>
							)}
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								{...register("password")}
								disabled={isSubmitting || isRedirecting}
							/>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || isRedirecting}
						>
							{isSubmitting
								? "Memproses..."
								: isRedirecting
								? "Mengalihkan..."
								: "Login"}
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

