"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Seminar } from "@/lib/schema";
import { api } from "@/lib/utils";
import { SeminarForm } from "@/components/form/seminar-form";
import { Card } from "@/components/ui/card";

const PageEditSeminar = () => {
	const { id } = useParams();
	const [seminar, setSeminar] = useState<Seminar | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		api
			.get(`/seminar/${id}`)
			.then((res) => {
				setSeminar(res.data);
				setError(null);
			})
			.catch(() => {
				setError("Gagal mengambil data seminar");
				setSeminar(null);
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;
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
