"use client";

import { useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Anggota } from "@/lib/schema";

const chartConfig = {
	count: {
		label: "Jumlah",
		color: "hsl(var(--primary))",
	},
} satisfies ChartConfig;

interface SabukDistributionChartProps {
	data: Anggota[];
}

export function SabukDistributionChart({ data }: SabukDistributionChartProps) {
	const chartData = useMemo(() => {
		const sabukCount: { [key: string]: number } = {};

		data.forEach((anggota) => {
			const sabuk = anggota.tingkatan_sabuk || "Belum Punya";
			if (!sabukCount[sabuk]) {
				sabukCount[sabuk] = 0;
			}
			sabukCount[sabuk]++;
		});

		// Order sabuk by progression
		const sabukOrder = [
			"Belum punya",
			"LULUS Binfistal",
			"Sabuk Hitam Wiraga 1",
			"Sabuk Hitam Wiraga 2",
			"Sabuk Hitam Wiraga 3",
      "Sabuk Putih",
			"Sabuk Hijau",
			"Sabuk Merah",
			"Sabuk Kuning",

		];

		return sabukOrder
			.filter((sabuk) => sabukCount[sabuk] > 0)
			.map((sabuk) => ({
				sabuk: sabuk.replace("Sabuk ", ""),
				count: sabukCount[sabuk],
			}));
	}, [data]);

	return (
		<Card className="shadow-none">
			<CardHeader>
				<CardTitle>Distribusi Tingkatan Sabuk</CardTitle>
				<CardDescription>
					Jumlah anggota berdasarkan tingkatan sabuk
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis
							dataKey="sabuk"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							angle={-45}
							textAnchor="end"
							height={100}
							fontSize={11}
						/>
						<YAxis tickLine={false} axisLine={false} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar
							dataKey="count"
							fill="var(--color-count)"
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
