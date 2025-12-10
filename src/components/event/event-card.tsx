"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
	id: number;
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	category: string;
	maxParticipants: number;
	registeredParticipants: number;
	image?: string;
	index?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
	id,
	title,
	description,
	date,
	time,
	location,
	category,
	maxParticipants,
	registeredParticipants,
	image,
	index = 0,
}) => {
	const isFullyBooked = registeredParticipants >= maxParticipants;
	const availableSeats = maxParticipants - registeredParticipants;

	return (
		<Card
			className="group overflow-hidden shadow-none hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4"
			style={{
				animationDelay: `${index * 50}ms`,
				animationFillMode: "backwards",
			}}
		>
			<div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
				{image ? (
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-110"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Calendar className="w-16 h-16 text-primary/30" />
					</div>
				)}
				<div className="absolute top-4 right-4">
					<Badge variant={isFullyBooked ? "destructive" : "default"}>
						{category}
					</Badge>
				</div>
			</div>

			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
						{title}
					</CardTitle>
				</div>
				<CardDescription className="line-clamp-2">
					{description}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-3">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="w-4 h-4 text-primary" />
					<span className="font-medium">{date}</span>
				</div>

				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock className="w-4 h-4 text-primary" />
					<span>{time}</span>
				</div>

				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="w-4 h-4 text-primary" />
					<span className="line-clamp-1">{location}</span>
				</div>

				<div className="flex items-center gap-2 text-sm">
					<Users className="w-4 h-4 text-primary" />
					<span
						className={
							isFullyBooked
								? "text-destructive font-medium"
								: "text-muted-foreground"
						}
					>
						{isFullyBooked ? "Kuota Penuh" : `${availableSeats} Kursi Tersedia`}
					</span>
				</div>

				<div className="pt-2">
					<div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
						<div
							className={`h-full transition-all duration-500 ${
								isFullyBooked ? "bg-destructive" : "bg-primary"
							}`}
							style={{
								width: `${(registeredParticipants / maxParticipants) * 100}%`,
							}}
						/>
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						{registeredParticipants} dari {maxParticipants} peserta terdaftar
					</p>
				</div>
			</CardContent>

			<CardFooter>
				<Link href={`/event/${id}`} className="w-full">
					<Button
						className="w-full group/btn"
						variant={isFullyBooked ? "outline" : "default"}
						disabled={isFullyBooked}
					>
						{isFullyBooked ? "Kuota Penuh" : "Lihat Detail"}
						{!isFullyBooked && (
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						)}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};
