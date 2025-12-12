"use client";

import { useQuery } from '@tanstack/react-query';
import Cookie from 'js-cookie';

interface Materi {
  id: number;
  id_course: number;
  judul: string;
  deskripsi: string;
  tipeKonten: string;
  konten?: string | null; // konten bisa null atau undefined
  tingkatan: string;
  urutan: number;
  createdAt: string;
  updatedAt: string;
}

// Backend Response Interface (as returned from API)
interface CourseFromAPI {
  id: number;
  judul: string;
  deskripsi: string;
  tingkatan_sabuk?: string | null;
  urutan: number;
  materialCount?: number;
  Materis: Materi[];
  createdAt: string;
  updatedAt: string;
}

// Frontend Interface (normalized for frontend use)
interface Course {
  id: number;
  nama_course: string;
  deskripsi_course: string;
  tingkatan_sabuk?: string | null;
  urutan: number;
  materialCount?: number;
  Materis: Materi[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: CourseFromAPI[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const fetchCourses = async (): Promise<Course[]> => {
  const token = Cookie.get('accessToken') || Cookie.get('token') || '';
  console.log('[useCourses] Fetching courses with token:', token ? 'Token exists' : 'No token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Gagal mengambil data kursus dari server.');
  }

  const result: ApiResponse = await response.json();
  console.log('[useCourses] API Response:', {
    success: result.success,
    dataLength: result.data?.length || 0,
    hasPagination: !!result.pagination
  });
  
  // Backend mengembalikan { success, status, message, data, pagination }
  // Map backend field names to frontend interface
  const mappedCourses: Course[] = (result.data || []).map(course => ({
    ...course,
    nama_course: course.judul,
    deskripsi_course: course.deskripsi,
  }));
  
  console.log('[useCourses] Mapped courses count:', mappedCourses.length);
  return mappedCourses;
};

export const useCourses = () => {
  const { data: courses = [], isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
  return { courses, isLoading, isError, refetch };
};

// Export types for use in other components
export type { Course, Materi };
