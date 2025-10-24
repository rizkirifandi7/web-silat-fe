"use client"

import { useRekeningCrud } from '@/hooks/use-rekening-crud';
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableRekening } from '@/components/data-table/data-table-rekening';

export default function RekeningPage() {
  const { loading } = useRekeningCrud();

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold">Manajemen Rekening</h1>
          <p className="text-muted-foreground mb-4">
            Halaman ini digunakan untuk mengelola data rekening.
          </p>
          <DataTableRekening />
        </div>
  )
}