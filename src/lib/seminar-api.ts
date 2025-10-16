import { Seminar } from "./schema";
import {api} from "./utils";

export const getSeminars = async (): Promise<Seminar[]> => {
  const response = await api.get("/seminar");
  return response.data;
};


export const createSeminar = async (formData: FormData): Promise<Seminar> => {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seminar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create seminar');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error creating seminar:', error);
      throw error;
  }
} 

export const updateSeminar = async (id: number, formData: FormData): Promise<Seminar> => {
  // Let the browser/axios set the Content-Type (with boundary) for FormData.
  const response = await api.put(`/seminar/${id}`, formData);

  return response.data;
};

export const deleteSeminar = async (id: number) => {
  await api.delete(`/seminar/${id}`);
};
