import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Menangani error dari panggilan API dan menampilkan pesan toast.
 * @param error Error yang ditangkap (sebaiknya AxiosError).
 * @param defaultMessage Pesan default jika tidak ada pesan error spesifik.
 * @throws {Error} Melempar error baru dengan pesan yang lebih deskriptif.
 */
export function handleApiError(error: unknown, defaultMessage: string): never {
	let errorMessage = defaultMessage;

	if (error instanceof AxiosError && error.response) {
		// Jika ada pesan error dari server, gunakan itu
		errorMessage = error.response.data.message || defaultMessage;
	} else if (error instanceof Error) {
		// Jika error umum, gunakan pesannya
		errorMessage = error.message;
	}

	toast.error(errorMessage);
	throw new Error(errorMessage);
}
