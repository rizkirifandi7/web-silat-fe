"use client";

import React from "react";
import { useUserContext } from "@/context/user-context";
import { bisaAksesMateri } from "@/lib/sabuk-utils";
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
	tingkatan: string;
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
	const { user } = useUserContext();
	// fallback jika tidak ada user atau tingkatan_sabuk
	const tingkatanAnggota = user?.tingkatan_sabuk || "";

	return (
		<div className="h-full overflow-y-auto">
			<h2 className="p-4 text-xl font-bold border-b">Daftar Materi</h2>
			<Accordion type="single" collapsible className="w-full">
				{courses.map((course) => {
					const materiList = course.Materis ?? [];
					return (
						<AccordionItem value={`course-${course.id}`} key={course.id}>
							<AccordionTrigger className="px-4 hover:bg-muted/50">
								<div className="text-left">
									<p className="font-semibold">{course.judul}</p>
									<p className="text-sm text-muted-foreground">
										{materiList.length} materi
									</p>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="flex flex-col gap-1 p-2">
									{materiList.map((materi: Materi) => {
										const terkunci = !bisaAksesMateri(
											tingkatanAnggota,
											materi.tingkatan
										);
										return (
											<Button
												key={materi.id}
												variant={
													selectedMateriId === materi.id ? "secondary" : "ghost"
												}
												className="w-full justify-start h-auto"
												onClick={() => !terkunci && onMateriSelect(materi)}
												disabled={terkunci}
											>
												<div className="flex items-center gap-3">
													{materi.tipeKonten === "video" ? (
														<Video className="h-5 w-5 text-red-500" />
													) : (
														<FileText className="h-5 w-5 text-blue-500" />
													)}
													<span className="text-sm text-wrap text-left">
														{materi.judul}
														{terkunci && (
															<span className="ml-2 text-xs text-orange-500 font-semibold">
																(Terkunci - Minimal {materi.tingkatan})
															</span>
														)}
													</span>
												</div>
											</Button>
										);
									})}
								</div>
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>
		</div>
	);
};

export default CourseSidebar;
