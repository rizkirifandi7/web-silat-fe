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
import { BookOpen, PlayCircle, ArrowRight } from "lucide-react";

interface Materi {
	id: number;
	judul: string;
	tipeKonten: string;
	konten: string;
	tingkatan: string;
}

interface CourseCardProps {
	id: number;
	judul: string;
	deskripsi: string;
	Materis?: Materi[];
	onSelect: (courseId: number) => void;
	index?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
	id,
	judul,
	deskripsi,
	Materis = [],
	onSelect,
	index = 0,
}) => {
	const materiCount = Materis.length;
	const videoCount = Materis.filter((m) => m.tipeKonten === "video").length;

	return (
		<Card
			className="group overflow-hidden shadow-none hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4"
			style={{
				animationDelay: `${index * 50}ms`,
				animationFillMode: "backwards",
			}}
			onClick={() => onSelect(id)}
		>
			<CardHeader className="space-y-3">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
						{judul}
					</CardTitle>
					<Badge
						variant="secondary"
						className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0"
					>
						{materiCount}
					</Badge>
				</div>
				<CardDescription className="line-clamp-2 min-h-[2.5rem]">
					{deskripsi || "Tidak ada deskripsi"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<BookOpen className="h-4 w-4" />
						<span>{materiCount} materi</span>
					</div>
					{videoCount > 0 && (
						<div className="flex items-center gap-1.5">
							<PlayCircle className="h-4 w-4" />
							<span>{videoCount} video</span>
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter className="pt-0">
				<Button
					className="w-full gap-2 group-hover:gap-3 transition-all"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onSelect(id);
					}}
				>
					<span>Mulai Belajar</span>
					<ArrowRight className="h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
};
