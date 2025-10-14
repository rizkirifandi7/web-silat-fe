import { Seminar, SeminarSchema } from "@/types";
import { API_URL } from ".";

export async function getSeminars(): Promise<Seminar[]> {
  const response = await fetch(`${API_URL}/seminar`);
  if (!response.ok) {
    throw new Error("Failed to fetch seminars");
  }
  return response.json();
}

export async function getSeminarById(id: string): Promise<Seminar> {
  const response = await fetch(`${API_URL}/seminar/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch seminar");
  }
  return response.json();
}

export async function addSeminar(data: SeminarSchema): Promise<Seminar> {
  const response = await fetch(`${API_URL}/seminar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to add seminar");
  }
  return response.json();
}

export async function updateSeminar(id: string, data: Partial<SeminarSchema>): Promise<Seminar> {
  const response = await fetch(`${API_URL}/seminar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update seminar");
  }
  return response.json();
}

export async function deleteSeminar(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/seminar/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete seminar");
  }
}
