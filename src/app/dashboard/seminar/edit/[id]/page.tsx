"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SeminarForm } from "@/components/form/seminar-form";
import { Card } from "@/components/ui/card";
import { useSeminarById } from "@/hooks/use-seminar-crud";

const PageEditSeminar = () => {
	const { id } = useParams();
	let seminarId: number | undefined = undefined;
	if (typeof id === "string" && !isNaN(Number(id))) {
		seminarId = Number(id);
	}
	const {
		data: seminar,
		isLoading,
		isError,
		error,
	} = useSeminarById(seminarId as number);

	if (isLoading) return <div>Loading...</div>;
	if (isError)
		return <div>{error?.message || "Gagal memuat data seminar."}</div>;
	if (!seminar) return <div>Seminar tidak ditemukan</div>;

	return (
		<div className="container mx-auto py-4">
			<h1 className="text-2xl font-bold mb-4">Edit Seminar</h1>
			<Card className="p-6 shadow-none">
				<SeminarForm seminar={seminar} />
			</Card>
		</div>
	);
};

export default PageEditSeminar;
