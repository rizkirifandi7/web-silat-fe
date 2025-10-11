"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { SeminarFormValues } from "@/hooks/use-seminar-crud";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextEditor from "./text-editor";

interface SeminarFormProps {
	form: UseFormReturn<SeminarFormValues>;
	onSubmit: (values: SeminarFormValues) => void;
	isSubmitting: boolean;
	submitText?: string;
	title?: string;
}

export function SeminarForm({
	form,
	onSubmit,
	isSubmitting,
	submitText = "Simpan",
	title = "Formulir Seminar",
}: SeminarFormProps) {
	return (
		<Card className="shadow-lg rounded-lg">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="judul"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Judul</FormLabel>
									<FormControl>
										<Input placeholder="Judul Seminar" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="deskripsi"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Deskripsi</FormLabel>
									<FormControl>
										<TextEditor/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="tanggal_mulai"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Tanggal Mulai</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(new Date(field.value), "PPP")
														) : (
															<span>Pilih tanggal</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={new Date(field.value)}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="tanggal_selesai"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Tanggal Selesai</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(new Date(field.value), "PPP")
														) : (
															<span>Pilih tanggal</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={new Date(field.value)}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="waktu_mulai"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Waktu Mulai</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="waktu_selesai"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Waktu Selesai</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="lokasi"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Lokasi</FormLabel>
									<FormControl>
										<Input placeholder="Lokasi Acara" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="link_acara"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Link Acara (Opsional)</FormLabel>
									<FormControl>
										<Input placeholder="https://example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="harga"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Harga</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="0"
												{...field}
												onChange={(e) =>
													field.onChange(parseInt(e.target.value, 10) || 0)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="kuota"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Kuota</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="0"
												{...field}
												onChange={(e) =>
													field.onChange(parseInt(e.target.value, 10) || 0)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Pilih status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Akan Datang">Akan Datang</SelectItem>
											<SelectItem value="Berlangsung">Berlangsung</SelectItem>
											<SelectItem value="Selesai">Selesai</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* File inputs can be added here */}
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Menyimpan..." : submitText}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
