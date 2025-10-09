"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdminData, createAdminSchema, editAdminSchema } from "@/lib/schema";

export type AdminFormValues = z.infer<
	typeof createAdminSchema | typeof editAdminSchema
>;

interface AdminFormProps {
	onSubmit: (values: AdminFormValues) => void;
	isPending: boolean;
	defaultValues?: Partial<AdminData>;
	isEdit?: boolean;
}

export function AdminForm({
	onSubmit,
	isPending,
	defaultValues,
	isEdit = false,
}: AdminFormProps) {
	const schema = isEdit ? editAdminSchema : createAdminSchema;
	const form = useForm<AdminFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			nama: defaultValues?.nama || "",
			email: defaultValues?.email || "",
			password: "",
			role: defaultValues?.role || "admin",
			no_telepon: defaultValues?.no_telepon || "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="nama"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nama</FormLabel>
							<FormControl>
								<Input placeholder="Nama Lengkap" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="email@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{isEdit ? "Password Baru (Opsional)" : "Password"}
							</FormLabel>
							<FormControl>
								<Input type="password" placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Pilih Role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="superadmin">Superadmin</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="no_telepon"
					render={({ field }) => (
						<FormItem>
							<FormLabel>No. Telepon</FormLabel>
							<FormControl>
								<Input placeholder="08xxxxxxxxxx" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isPending} className="w-full">
					{isPending ? "Menyimpan..." : "Simpan"}
				</Button>
			</form>
		</Form>
	);
}
