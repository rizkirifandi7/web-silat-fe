import { Seminar } from "./schema";
import {api} from "./utils";

export const getSeminars = async (): Promise<Seminar[]> => {
  const response = await api.get("/seminar");
  return response.data;
};


export const createSeminar = async (formData: FormData): Promise<Seminar> => {
  const response = await api.post("/seminar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
} 

export const updateSeminar = async (id: number, formData: FormData): Promise<Seminar> => {
  const response = await api.put(`/seminar/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteSeminar = async (id: number) => {
  await api.delete(`/seminar/${id}`);
};
