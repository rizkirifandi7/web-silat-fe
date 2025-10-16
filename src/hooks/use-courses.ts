"use client";

import { useQuery } from '@tanstack/react-query';
import Cookie from 'js-cookie';

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
  Materi: Materi[];
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/anggota`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookie.get('token') || ''}`,
    },
  });
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
