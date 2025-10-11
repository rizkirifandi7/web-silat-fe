import axios from "axios";
import { Seminar } from "@/types/seminar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSeminars = async (): Promise<Seminar[]> => {
	const response = await axios.get(`${API_URL}/seminar`);
	return response.data;
};

export const createSeminar = async (seminar: Omit<Seminar, "id">): Promise<Seminar> => {
	const response = await axios.post(`${API_URL}/seminar`, seminar);
	return response.data;
};

export const updateSeminar = async (id: string, seminar: Partial<Seminar>): Promise<Seminar> => {
	const response = await axios.put(`${API_URL}/seminar/${id}`, seminar);
	return response.data;
};

export const deleteSeminar = async (id: string): Promise<void> => {
	await axios.delete(`${API_URL}/seminar/${id}`);
};
