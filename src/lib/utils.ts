import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Important for cookies
});

// Track refresh token request
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with auto token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<{ message?: string; errors?: Array<{ field: string; message: string }> }>) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean });
    const { response } = error;

    // Network error
    if (!response) {
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      return Promise.reject(error);
    }

    // Handle 401 with auto token refresh
    if (response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data.data;
        
        // Store new access token
        Cookies.set("accessToken", accessToken, { 
          expires: 1/96, // 15 minutes
          path: "/",
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh failed, logout user
        Cookies.remove("accessToken");
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error status codes
    switch (response.status) {
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;

      case 404:
        toast.error(response.data.message || "Resource not found.");
        break;

      case 422:
        const errors = response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.data.message || "Validation failed.");
        }
        break;

      case 429:
        toast.error("Too many requests. Please try again later.");
        break;

      case 500:
        toast.error("Server error. Please try again later.");
        break;

      default:
        toast.error(response.data.message || "An error occurred.");
    }

    return Promise.reject(error);
  }
);


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
