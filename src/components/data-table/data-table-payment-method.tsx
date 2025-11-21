"use client";

import { useState } from "react";
import { PaymentMethod } from "@/lib/payment-method-api";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import Image from "next/image";

interface DataTablePaymentMethodProps {
	data: PaymentMethod[];
	loading: boolean;
	onEdit: (paymentMethod: PaymentMethod) => void;
	onDelete: (paymentMethod: PaymentMethod) => void;
}

export function DataTablePaymentMethod({
	data,
	loading,
	onEdit,
	onDelete,
}: DataTablePaymentMethodProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredData = data.filter(
		(item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.channel.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const formatFee = (type: string, value: number) => {
		if (type === "percentage") {
			return `${value}%`;
		}
		return `Rp ${value.toLocaleString("id-ID")}`;
	};

	const getChannelLabel = (channel: string) => {
		const labels: Record<string, string> = {
			bank_transfer: "Bank Transfer",
			e_wallet: "E-Wallet",
			qris: "QRIS",
			credit_card: "Credit Card",
			va: "Virtual Account",
		};
		return labels[channel] || channel;
	};

	return (
		<div className="space-y-4">
			{/* Search */}
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Cari nama atau channel..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Icon</TableHead>
							<TableHead>Nama</TableHead>
							<TableHead>Channel</TableHead>
							<TableHead>Kode Midtrans</TableHead>
							<TableHead>Biaya Admin</TableHead>
							<TableHead>Urutan</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-10">
									Loading...
								</TableCell>
							</TableRow>
						) : filteredData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-10">
									Tidak ada data metode pembayaran
								</TableCell>
							</TableRow>
						) : (
							filteredData.map((item) => (
								<TableRow key={item.id}>
									<TableCell>
										{item.icon_url ? (
											<Image
												src={item.icon_url}
												alt={item.name}
												width={40}
												height={40}
												className="rounded object-contain"
											/>
										) : (
											<div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
												No Icon
											</div>
										)}
									</TableCell>
									<TableCell className="font-medium">{item.name}</TableCell>
									<TableCell>{getChannelLabel(item.channel)}</TableCell>
									<TableCell>
										<code className="text-xs bg-muted px-1 py-0.5 rounded">
											{item.midtrans_code || "-"}
										</code>
									</TableCell>
									<TableCell>
										{formatFee(item.admin_fee_type, item.admin_fee_value)}
									</TableCell>
									<TableCell>{item.sort_order}</TableCell>
									<TableCell>
										{item.is_active ? (
											<Badge variant="default">Aktif</Badge>
										) : (
											<Badge variant="secondary">Nonaktif</Badge>
										)}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="w-4 h-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => onEdit(item)}>
													<Pencil className="w-4 h-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => onDelete(item)}
													className="text-destructive"
												>
													<Trash2 className="w-4 h-4 mr-2" />
													Hapus
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
