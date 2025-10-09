"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
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
import { Anggota } from "@/lib/schema";

export const description =
	"An interactive area chart showing new members over time";

const chartConfig = {
	newMembers: {
		label: "Anggota Baru",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
	data: Anggota[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
	const isMobile = useIsMobile();

	const processedData = React.useMemo(() => {
		const monthlyData: { [key: string]: number } = {};

		data.forEach((anggota) => {
			if (anggota.createdAt) {
				const date = new Date(anggota.createdAt);
				const month = date.toLocaleString("default", {
					month: "short",
					year: "numeric",
				});
				if (!monthlyData[month]) {
					monthlyData[month] = 0;
				}
				monthlyData[month]++;
			}
		});

		const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
			return new Date(a).getTime() - new Date(b).getTime();
		});

		return sortedMonths.map((month) => ({
			month,
			newMembers: monthlyData[month],
		}));
	}, [data]);

	return (
		<Card className="@container/card shadow-none">
			<CardHeader>
				<CardTitle>Pendaftaran Anggota Baru</CardTitle>
				<CardDescription>
					Menampilkan jumlah anggota baru yang terdaftar setiap bulan.
				</CardDescription>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={processedData}>
						<defs>
							<linearGradient id="fillNewMembers" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-newMembers)"
									stopOpacity={1.0}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-newMembers)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={isMobile ? 32 : undefined}
							tickFormatter={(value) => {
								if (isMobile) {
									return value.slice(0, 3);
								}
								return value;
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<Area
							dataKey="newMembers"
							type="natural"
							fill="url(#fillNewMembers)"
							stroke="var(--color-newMembers)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
