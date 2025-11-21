"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Loader2 } from "lucide-react";
import { useCampaigns } from "@/hooks/use-donasi";

// Format number to Rupiah
const formatRupiah = (amount: string | number) => {
	const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(numAmount);
};

export default function DonasiPage() {
	const { campaigns, loading, error } = useCampaigns();

	return (
		<section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tighter md:text-4xl">
							Donasi
						</h1>
						<p className="text-muted-foreground text-sm md:text-base/relaxed max-w-2xl">
							Dukungan Anda sangat berarti bagi kami. Dengan berdonasi, Anda
							turut serta dalam menjaga dan melestarikan budaya Pencak Silat.
						</p>
					</div>

					{/* Loading State */}
					{loading && (
						<div className="flex justify-center items-center min-h-[400px]">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
						</div>
					)}

					{/* Error State */}
					{error && (
						<div className="text-center py-12">
							<p className="text-destructive">Error: {error}</p>
						</div>
					)}

					{/* Empty State */}
					{!loading && !error && campaigns.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								Belum ada campaign donasi tersedia
							</p>
						</div>
					)}

					{/* Campaign Grid */}
					{!loading && !error && campaigns.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-6 mt-8">
							{campaigns.map((campaign) => {
								return (
									<Card
										key={campaign.id}
										className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden p-0 h-full"
									>
										<CardContent className="p-0">
											{/* Image Section */}
											<Link href={`/donasi/${campaign.slug}`} className="block">
												<div className="relative h-48 w-full overflow-hidden cursor-pointer">
													<Image
														src={campaign.image_url || "/silat.png"}
														alt={campaign.title}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-110"
													/>
												</div>
											</Link>

											{/* Content Section */}
											<div className="p-4 space-y-3">
												<h2 className="text-base font-semibold text-foreground line-clamp-1">
													{campaign.title}
												</h2>

												{/* Progress Section */}
												<div className="space-y-2">
													<div className="flex justify-between items-center text-xs">
														<span className="font-medium text-foreground">
															{formatRupiah(campaign.collected_amount)}
														</span>
														<span className="text-muted-foreground">
															{parseFloat(campaign.progress_percentage).toFixed(
																0
															)}
															%
														</span>
													</div>
													<Progress
														value={parseFloat(campaign.progress_percentage)}
														className="h-2"
													/>
													<div className="flex justify-between items-center text-xs text-muted-foreground">
														<span>
															Target: {formatRupiah(campaign.target_amount)}
														</span>
														<span className="flex items-center gap-1">
															<Users className="w-3 h-3" />
															{campaign.total_supporters}
														</span>
													</div>
												</div>

												{/* Button */}
												<Button className="w-full group/btn" asChild>
													<Link href={`/donasi/${campaign.slug}`}>
														Donasi Sekarang
													</Link>
												</Button>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
