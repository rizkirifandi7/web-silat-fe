"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const PasswordSchema = z
	.object({
		oldPassword: z.string().nonempty("Password lama harus diisi."),
		newPassword: z.string().min(6, "Password baru minimal harus 6 karakter."),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Password baru dan konfirmasi tidak cocok.",
		path: ["confirmPassword"],
	});

export function UbahPasswordDialog({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof PasswordSchema>) {
		setIsSubmitting(true);
		try {
			// Anda perlu mendapatkan token dari suatu tempat (misal: local storage, context)
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Otentikasi dibutuhkan. Silakan login kembali.");
				// Mungkin arahkan ke halaman login
				return;
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					// userId akan diambil dari token di backend, tidak perlu dikirim
					oldPassword: values.oldPassword,
					newPassword: values.newPassword,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Gagal mengubah password.");
			}

			toast.success("Password berhasil diubah!");
			form.reset();
			setIsOpen(false);
		} catch (error) {
			console.error("Error changing password:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Terjadi kesalahan yang tidak diketahui.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Ubah Password</DialogTitle>
					<DialogDescription>
						Masukkan password lama dan password baru Anda.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="oldPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password Lama</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password Baru</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Konfirmasi Password Baru</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
