"use client";

import { useState } from "react";
import { useUserContext } from "@/context/user-context";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { loginUser } from "@/lib/auth-api";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string>("");

	const { login } = useUserContext();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Email dan password harus diisi");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await loginUser(email, password);
			const { accessToken, user } = response.data;

			// Login without auto-redirect, user stays on landing page
			login(accessToken, user);
			toast.success(`Selamat datang kembali, ${user.nama}!`);
		} catch (error: unknown) {
			let errorMessage = "Email atau password salah";

			if (error && typeof error === "object") {
				if ("response" in error) {
					const axiosError = error as {
						response?: { data?: { message?: string } };
					};
					errorMessage = axiosError.response?.data?.message || errorMessage;
				} else if ("message" in error) {
					const err = error as { message: string };
					errorMessage = err.message || errorMessage;
				}
			}

			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex flex-col gap-6">
					{/* Header */}
					<div className="flex flex-col items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-md">
							<Image
								src="/pusamada-logo.png"
								alt="Logo PUSAMADA"
								width={40}
								height={40}
								priority
							/>
						</div>
						<h1 className="text-xl font-bold">Selamat Datang</h1>
						<div className="text-center text-sm text-muted-foreground">
							Masuk ke akun Anda untuk melanjutkan
						</div>
					</div>

					{/* Error Alert */}
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Email Input */}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="nama@contoh.com"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setError("");
							}}
							disabled={isSubmitting}
							required
							autoComplete="email"
						/>
					</div>

					{/* Password Input */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
						</div>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Masukkan password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setError("");
								}}
								disabled={isSubmitting}
								required
								autoComplete="current-password"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								disabled={isSubmitting}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
						</div>
					</div>

					{/* Submit Button */}
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Memproses...
							</>
						) : (
							"Masuk"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
