"use client";

import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, Video } from "lucide-react";

interface Course {
	id: number;
	judul: string;
	deskripsi: string;
	Materis: Materi[];
}

interface Materi {
	id: number;
	judul: string;
	tipeKonten: string;
	konten: string;
}

interface CourseSidebarProps {
	courses: Course[];
	onMateriSelect: (materi: Materi) => void;
	selectedMateriId: number | null;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
	courses,
	onMateriSelect,
	selectedMateriId,
}) => {
	return (
		<div className="h-full overflow-y-auto">
			<h2 className="p-4 text-xl font-bold border-b">Daftar Materi</h2>
			<Accordion type="single" collapsible className="w-full">
				{courses.map((course) => (
					<AccordionItem value={`course-${course.id}`} key={course.id}>
						<AccordionTrigger className="px-4 hover:bg-muted/50">
							<div className="text-left">
								<p className="font-semibold">{course.judul}</p>
								<p className="text-sm text-muted-foreground">
									{course.Materis.length} materi
								</p>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="flex flex-col gap-1 p-2">
								{course.Materis.map((materi) => (
									<Button
										key={materi.id}
										variant={
											selectedMateriId === materi.id ? "secondary" : "ghost"
										}
										className="w-full justify-start h-auto"
										onClick={() => onMateriSelect(materi)}
									>
										<div className="flex items-center gap-3">
											{materi.tipeKonten === "video" ? (
												<Video className="h-5 w-5 text-red-500" />
											) : (
												<FileText className="h-5 w-5 text-blue-500" />
											)}
											<span className="text-sm text-wrap text-left">
												{materi.judul}
											</span>
										</div>
									</Button>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default CourseSidebar;
