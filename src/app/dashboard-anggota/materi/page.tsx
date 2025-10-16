"use client";

import React, { useState } from "react";
import CourseSidebar from "@/components/course-sidebar";
import MateriViewer from "@/components/materi-viewer";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/use-courses";

interface Materi {
	id: number;
	judul: string;
	tipeKonten: string;
	konten: string;
}

const PageMateri = () => {
	const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
	const { courses, isLoading, isError } = useCourses();

	if (isLoading) {
		return (
			<div className="h-screen w-full flex flex-col">
				<div className="p-4 border-b">
					<h1 className="text-2xl font-bold">Ruang Materi</h1>
					<p className="text-muted-foreground">
						Selamat datang di pusat pembelajaran. Silakan pilih materi untuk
						memulai.
					</p>
				</div>
				<ResizablePanelGroup
					direction="horizontal"
					className="flex-grow rounded-lg border"
				>
					<ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
						<div className="p-4 space-y-4">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={75}>
						<div className="p-4 h-full">
							<Skeleton className="h-full w-full" />
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-destructive">
						Gagal Memuat Materi
					</h2>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-full flex flex-col p-4 md:p-6 gap-4">
			<div className="py-4">
				<h1 className="text-2xl font-bold">Ruang Materi</h1>
				<p className="text-muted-foreground">
					Selamat datang di pusat pembelajaran. Silakan pilih materi untuk
					memulai.
				</p>
			</div>
			<ResizablePanelGroup
				direction="horizontal"
				className="flex-grow rounded-lg border"
			>
				<ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
					<CourseSidebar
						courses={courses}
						onMateriSelect={setSelectedMateri}
						selectedMateriId={selectedMateri?.id || null}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={75}>
					<MateriViewer selectedMateri={selectedMateri} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export default PageMateri;
