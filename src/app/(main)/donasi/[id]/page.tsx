"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Heart,
	Users,
	Calendar,
	Target,
	TrendingUp,
	ArrowLeft,
	Share2,
	Clock,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { useCampaignDetail } from "@/hooks/use-donasi";

const formatRupiah = (amount: string | number) => {
	const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(numAmount);
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const formatTimeAgo = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInHours / 24);

	if (diffInHours < 1) return "Baru saja";
	if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
	if (diffInDays === 1) return "1 hari yang lalu";
	return `${diffInDays} hari yang lalu`;
};

const PageDonasiDetail = () => {
	const params = useParams();
	const router = useRouter();
	const slug = params.id as string;

	// Use custom hook to fetch campaign detail
	const { campaign, loading, error } = useCampaignDetail(slug);

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	// Error state
	if (error || !campaign) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold">
						{error || "Donasi tidak ditemukan"}
					</h2>
					<Button onClick={() => router.push("/donasi")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Kembali ke Donasi
					</Button>
				</div>
			</div>
		);
	}

	const progressPercentage = parseFloat(campaign.progress_percentage);

	return (
		<div className="min-h-screen py-8 md:py-12">
			<div className="container max-w-7xl mx-auto px-4">
				{/* Back Button */}
				<Button
					variant="ghost"
					onClick={() => router.push("/donasi")}
					className="mb-6"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Kembali
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Hero Image & Title */}
						<Card className="overflow-hidden">
							<div className="relative h-64 md:h-96 w-full">
								<Image
									src={campaign.image_url || "/silat.png"}
									alt={campaign.title}
									fill
									className="object-cover"
									priority
								/>
								{campaign.status && (
									<div className="absolute top-4 left-4">
										<Badge className="bg-background/80 backdrop-blur-sm">
											{campaign.status}
										</Badge>
									</div>
								)}
							</div>
							<CardContent className="p-6 space-y-4">
								<div>
									<h1 className="text-2xl md:text-3xl font-bold mb-2">
										{campaign.title}
									</h1>
									<p className="text-muted-foreground">
										{campaign.description}
									</p>
								</div>

								{/* Organizer */}
								{campaign.organizer_name && (
									<div className="flex items-center gap-3 pt-2">
										<Avatar>
											<AvatarImage
												src={campaign.organizer_image_url || "/silat.png"}
											/>
											<AvatarFallback>
												{campaign.organizer_name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm font-medium">Penyelenggara</p>
											<p className="text-sm text-muted-foreground">
												{campaign.organizer_name}
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Description */}
						<Card>
							<CardHeader>
								<CardTitle>Tentang Program Ini</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{campaign.full_description ? (
									<div
										className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
										dangerouslySetInnerHTML={{
											__html: campaign.full_description,
										}}
									/>
								) : (
									<p className="text-muted-foreground leading-relaxed">
										{campaign.description}
									</p>
								)}

								{campaign.benefits && campaign.benefits.length > 0 && (
									<>
										<Separator />
										<div>
											<h3 className="font-semibold mb-3 flex items-center gap-2">
												<CheckCircle2 className="w-5 h-5 text-green-500" />
												Manfaat untuk Donatur
											</h3>
											<ul className="space-y-2">
												{campaign.benefits.map((benefit, index) => (
													<li
														key={index}
														className="flex items-start gap-2 text-sm text-muted-foreground"
													>
														<span className="text-green-500 mt-0.5">✓</span>
														{benefit.benefit_text}
													</li>
												))}
											</ul>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Recent Donations */}
						{campaign.donations && campaign.donations.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Heart className="w-5 h-5 text-red-500" />
										Donasi Terbaru
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{campaign.donations.map((donation, index) => (
											<div
												key={index}
												className="flex items-center justify-between py-2"
											>
												<div className="flex items-center gap-3">
													<Avatar className="w-10 h-10">
														<AvatarFallback>
															{donation.donor_name.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-medium text-sm">
															{donation.donor_name}
														</p>
														<p className="text-xs text-muted-foreground flex items-center gap-1">
															<Clock className="w-3 h-3" />
															{formatTimeAgo(donation.created_at)}
														</p>
														{donation.donor_message && (
															<p className="text-xs text-muted-foreground mt-1">
																&quot;{donation.donor_message}&quot;
															</p>
														)}
													</div>
												</div>
												<p className="font-semibold text-sm">
													{formatRupiah(donation.donation_amount)}
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-20 space-y-4">
							{/* Donation Stats */}
							<Card>
								<CardContent className="p-6 space-y-6">
									{/* Progress */}
									<div className="space-y-3">
										<div className="flex justify-between items-baseline">
											<div>
												<p className="text-2xl md:text-3xl font-bold">
													{formatRupiah(campaign.collected_amount)}
												</p>
												<p className="text-sm text-muted-foreground mt-1">
													terkumpul dari {formatRupiah(campaign.target_amount)}
												</p>
											</div>
										</div>
										<Progress value={progressPercentage} className="h-3" />
										<p className="text-sm font-medium text-muted-foreground">
											{progressPercentage.toFixed(1)}% tercapai
										</p>
									</div>

									<Separator />

									{/* Stats Grid */}
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-1">
											<div className="flex items-center gap-2 text-muted-foreground">
												<Users className="w-4 h-4" />
												<span className="text-xs">Donatur</span>
											</div>
											<p className="text-2xl font-bold">
												{campaign.total_supporters}
											</p>
										</div>
										{campaign.days_remaining !== undefined && (
											<div className="space-y-1">
												<div className="flex items-center gap-2 text-muted-foreground">
													<Calendar className="w-4 h-4" />
													<span className="text-xs">Hari Tersisa</span>
												</div>
												<p className="text-2xl font-bold">
													{campaign.days_remaining}
												</p>
											</div>
										)}
									</div>

									<Separator />

									{/* Action Buttons */}
									<div className="space-y-3">
										<Button size="lg" className="w-full group" asChild>
											<Link href={`/donasi/${campaign.slug}/payment`}>
												<Heart className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
												Donasi Sekarang
											</Link>
										</Button>
										<Button variant="outline" size="lg" className="w-full">
											<Share2 className="w-4 h-4 mr-2" />
											Bagikan
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Campaign Info */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Informasi Kampanye
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-start gap-3">
										<Target className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div className="flex-1">
											<p className="text-sm font-medium">Target Dana</p>
											<p className="text-sm text-muted-foreground">
												{formatRupiah(campaign.target_amount)}
											</p>
										</div>
									</div>
									{campaign.created_at && (
										<>
											<Separator />
											<div className="flex items-start gap-3">
												<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div className="flex-1">
													<p className="text-sm font-medium">Dibuat Pada</p>
													<p className="text-sm text-muted-foreground">
														{formatDate(campaign.created_at)}
													</p>
												</div>
											</div>
										</>
									)}
									<Separator />
									<div className="flex items-start gap-3">
										<TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div className="flex-1">
											<p className="text-sm font-medium">Status</p>
											<Badge
												variant={
													campaign.days_remaining && campaign.days_remaining > 7
														? "default"
														: "destructive"
												}
												className="mt-1"
											>
												{campaign.status || "Aktif"}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PageDonasiDetail;
