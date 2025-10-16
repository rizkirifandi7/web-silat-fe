"use client";

import { useQuery } from '@tanstack/react-query';

interface Materi {
  id: number;
  judul: string;
  tipeKonten: string;
  konten: string;
}

interface Course {
  id: number;
  judul: string;
  deskripsi: string;
  Materis: Materi[];
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course`);
  if (!response.ok) {
    throw new Error('Gagal mengambil data kursus dari server.');
  }
  return response.json();
};

export const useCourses = () => {
  const { data: courses = [], isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
  return { courses, isLoading, isError, refetch };
};
