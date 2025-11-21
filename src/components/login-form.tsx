"use client";

import { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/context/user-context";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { loginUser, isValidEmail, validatePassword } from "@/lib/auth-api";

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60000; // 1 minute in milliseconds

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});

	// Rate limiting state
	const [loginAttempts, setLoginAttempts] = useState(0);
	const [isLockedOut, setIsLockedOut] = useState(false);
	const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
	const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

	const { login } = useUserContext();

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (lockoutTimerRef.current) {
				clearInterval(lockoutTimerRef.current);
			}
		};
	}, []);

	// Handle lockout countdown
	useEffect(() => {
		if (isLockedOut && lockoutTimeRemaining > 0) {
			lockoutTimerRef.current = setInterval(() => {
				setLockoutTimeRemaining((prev) => {
					if (prev <= 1) {
						setIsLockedOut(false);
						setLoginAttempts(0);
						if (lockoutTimerRef.current) {
							clearInterval(lockoutTimerRef.current);
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (lockoutTimerRef.current) {
				clearInterval(lockoutTimerRef.current);
			}
		};
	}, [isLockedOut, lockoutTimeRemaining]);

	// Validate form inputs
	const validateForm = (): boolean => {
		const newErrors: typeof errors = {};

		// Email validation
		if (!email.trim()) {
			newErrors.email = "Email tidak boleh kosong.";
		} else if (!isValidEmail(email)) {
			newErrors.email = "Format email tidak valid.";
		}

		// Password validation
		if (!password) {
			newErrors.password = "Password tidak boleh kosong.";
		} else {
			const passwordValidation = validatePassword(password);
			if (!passwordValidation.isValid) {
				newErrors.password = passwordValidation.message;
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle login submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Clear previous errors
		setErrors({});

		// Check if locked out
		if (isLockedOut) {
			toast.error(
				`Terlalu banyak percobaan login. Coba lagi dalam ${lockoutTimeRemaining} detik.`
			);
			return;
		}

		// Validate form
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		const toastId = toast.loading("Mencoba masuk...");

		try {
			const response = await loginUser(email, password);
			const { token, user } = response.data;

			// Reset login attempts on success
			setLoginAttempts(0);

			// Call login from context
			login(token, user);

			toast.success(`Selamat datang kembali, ${user.nama}!`, { id: toastId });
		} catch (error) {
			// Increment login attempts
			const newAttempts = loginAttempts + 1;
			setLoginAttempts(newAttempts);

			// Check if should lock out
			if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
				setIsLockedOut(true);
				setLockoutTimeRemaining(LOCKOUT_DURATION / 1000);
				toast.error(
					"Terlalu banyak percobaan login. Akun dikunci sementara selama 1 menit.",
					{ id: toastId }
				);
			} else {
				const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
				const errorMessage =
					error && typeof error === "object" && "message" in error
						? (error.message as string)
						: "Terjadi kesalahan saat login.";

				setErrors({ general: errorMessage });
				toast.error(
					`${errorMessage} (${remainingAttempts} percobaan tersisa)`,
					{ id: toastId }
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle email input change
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (errors.email) {
			setErrors((prev) => ({ ...prev, email: undefined }));
		}
	};

	// Handle password input change
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (errors.password) {
			setErrors((prev) => ({ ...prev, password: undefined }));
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
									alt="Logo PUSAMADA"
									width={40}
									height={40}
									priority
								/>
							</div>
						</a>
						<h1 className="text-xl font-bold">Selamat Datang</h1>
						<div className="text-center text-sm">
							Masuk ke akun Anda untuk melanjutkan
						</div>
					</div>

					{/* General error alert */}
					{errors.general && (
						<Alert variant="destructive" className="animate-in fade-in-50">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{errors.general}</AlertDescription>
						</Alert>
					)}

					{/* Lockout warning */}
					{isLockedOut && (
						<Alert variant="destructive" className="animate-in fade-in-50">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Terlalu banyak percobaan login. Silakan coba lagi dalam{" "}
								{lockoutTimeRemaining} detik.
							</AlertDescription>
						</Alert>
					)}

					<div className="flex flex-col gap-6">
						{/* Email input */}
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="nama@example.com"
								value={email}
								onChange={handleEmailChange}
								disabled={isSubmitting || isLockedOut}
								className={cn(errors.email && "border-destructive")}
								autoComplete="email"
								aria-invalid={!!errors.email}
								aria-describedby={errors.email ? "email-error" : undefined}
							/>
							{errors.email && (
								<p
									id="email-error"
									className="text-sm text-destructive animate-in fade-in-50"
								>
									{errors.email}
								</p>
							)}
						</div>

						{/* Password input */}
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={handlePasswordChange}
									disabled={isSubmitting || isLockedOut}
									className={cn(
										"pr-10",
										errors.password && "border-destructive"
									)}
									autoComplete="current-password"
									aria-invalid={!!errors.password}
									aria-describedby={
										errors.password ? "password-error" : undefined
									}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isSubmitting || isLockedOut}
									aria-label={
										showPassword ? "Sembunyikan password" : "Tampilkan password"
									}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>
							{errors.password && (
								<p
									id="password-error"
									className="text-sm text-destructive animate-in fade-in-50"
								>
									{errors.password}
								</p>
							)}
						</div>

						{/* Submit button */}
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || isLockedOut}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Memproses...
								</>
							) : isLockedOut ? (
								`Dikunci (${lockoutTimeRemaining}s)`
							) : (
								"Masuk"
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

