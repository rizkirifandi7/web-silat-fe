import { SeminarForm } from "@/components/form/seminar-form";
import { Card } from "@/components/ui/card";
import React from "react";

const PageTambahSeminar = () => {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Tambah Seminar</h1>
			<p className="text-muted-foreground mb-4">
				Isi form berikut untuk menambahkan seminar baru.
			</p>
			<Card className="p-6 shadow-none">
				<SeminarForm />
			</Card>
		</div>
	);
};

export default PageTambahSeminar;
