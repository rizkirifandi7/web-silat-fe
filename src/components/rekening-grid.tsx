"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type RekeningItem = {
	id: number;
	logo: string;
	namaBank: string;
	noRekening: string;
	namaPemilik: string;
};

type RekeningGridProps = {
	rekeningData: RekeningItem[];
};

export function RekeningGrid({ rekeningData }: RekeningGridProps) {
	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Berhasil disalin", {
			description: `${text} telah disalin ke clipboard.`,
		});
	};

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{rekeningData.map((rekening) => (
					<Card
						key={rekening.id}
						className="flex flex-col bg-card text-card-foreground shadow-none transition-all hover:shadow-md"
					>
						<CardHeader className="flex flex-row items-center gap-4">
							<div className="relative h-20 w-20 flex-shrink-0">
								<Image
									src={rekening.logo}
									alt={rekening.namaBank}
									layout="fill"
									objectFit="contain"
								/>
							</div>
							<div className="flex-1">
								<CardTitle className="text-base font-medium">
									{rekening.namaBank}
								</CardTitle>
								<p className="text-sm text-muted-foreground">
									{rekening.namaPemilik}
								</p>
							</div>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col justify-end">
							<div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
								<p className="text-base font-semibold tracking-wider">
									{rekening.noRekening}
								</p>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleCopy(rekening.noRekening)}
									aria-label="Salin nomor rekening"
									className="h-8 w-8"
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
