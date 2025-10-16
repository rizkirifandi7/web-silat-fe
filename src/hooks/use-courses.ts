"use client";

import { useQuery } from '@tanstack/react-query';
import Cookie from 'js-cookie';

interface Materi {
  id: number;
  judul: string;
  tipeKonten: string;
  konten: string;
  tingkatan: string;
}

interface Course {
  id: number;
  judul: string;
  deskripsi: string;
  Materi: Materi[];
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookie.get('token') || ''}`,
    },
  });
  if (!response.ok) {
    throw new Error('Gagal mengambil data kursus dari server.');
  }

  const data = await response.json();
  console.log('Fetch Courses Response:', data);
  return data;
};

export const useCourses = () => {
  const { data: courses = [], isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
  return { courses, isLoading, isError, refetch };
};
