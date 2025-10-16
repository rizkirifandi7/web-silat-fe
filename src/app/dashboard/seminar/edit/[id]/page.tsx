"use client";

import React from "react";
import { useParams } from "next/navigation";

const PageEditSeminar = () => {
	const { id } = useParams();
	return <div>PageEditSeminar {id}</div>;
};

export default PageEditSeminar;
