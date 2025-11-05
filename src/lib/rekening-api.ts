import { api } from "./utils";
import { Rekening } from "@/lib/schema";

export const getRekening = async (): Promise<Rekening[]> => {
  try {
    const response = await api.get("/rekening");
    return response.data;
  } catch (error) {
    console.error("Error fetching rekening:", error);
    // Return empty array during build time or when API is unavailable
    return [];
  }
};

export const createRekening = async (
  formData: FormData
): Promise<Rekening> => {
  try {
    const response = await api.post("/rekening", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating rekening:", error);
    throw error;
  }
};

export const updateRekening = async (
  id: number,
  formData: FormData
): Promise<Rekening> => {
  try {
    const response = await api.put(`/rekening/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating rekening with id ${id}:`, error);
    throw error;
  }
};

export const deleteRekening = async (id: number): Promise<void> => {
    try {
        await api.delete(`/rekening/${id}`);
    } catch (error) {
        console.error(`Error deleting rekening with id ${id}:`, error);
        throw error;
    }
};
