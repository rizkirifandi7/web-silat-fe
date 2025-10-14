"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, LinkIcon, DollarSignIcon, ShareIcon, ArrowLeftIcon } from 'lucide-react'

// Data mock untuk demo
const mockSeminar = {
  id: "1",
  gambar: "/silat.jpg",
  judul: "Workshop Pencak Silat: Teknik Dasar untuk Pemula",
  deskripsi: `
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Deskripsi</h3>
      <p>Workshop ini dirancang khusus untuk para pemula yang ingin mempelajari seni bela diri Pencak Silat. Dalam workshop ini, peserta akan diperkenalkan dengan teknik-teknik dasar Pencak Silat, sejarah, dan filosofi yang mendasari seni bela diri tradisional Indonesia ini.</p>
      
      <h3 class="text-lg font-semibold">Materi yang akan dipelajari:</h3>
      <ul class="list-disc pl-6 space-y-1">
        <li>Sejarah dan filosofi Pencak Silat</li>
        <li>Teknik kuda-kuda (stance) dasar</li>
        <li>Gerakan langkah dan perpindahan</li>
        <li>Teknik pukulan dan tendangan dasar</li>
        <li>Teknik tangkisan dan hindaran</li>
        <li>Praktik berpasangan sederhana</li>
      </ul>
      
      <h3 class="text-lg font-semibold">Yang akan Anda dapatkan:</h3>
      <ul class="list-disc pl-6 space-y-1">
        <li>Sertifikat kehadiran digital</li>
        <li>Modul pembelajaran Pencak Silat</li>
        <li>Akses ke komunitas PUSAMADA</li>
        <li>Konsultasi gratis dengan instruktur</li>
      </ul>
    </div>
  `,
  tanggal: "15 November 2025",
  waktu_mulai: "09:00",
  waktu_selesai: "17:00",
  lokasi: "Gedung Serbaguna PUSAMADA, Jakarta",
  link_acara: "https://meet.google.com/xyz-abc-def",
  harga: 150000,
  kuota: 50,
  status: "Akan Datang",
  gambar_banner: "/silat.png"
}

const SeminarDetailPage = () => {
  const [isRegistered, setIsRegistered] = useState(false)
  const [remainingQuota, setRemainingQuota] = useState(45)

  const handleRegister = () => {
    setIsRegistered(true)
    setRemainingQuota(prev => prev - 1)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Akan Datang":
        return "default"
      case "Berlangsung":
        return "secondary"
      case "Selesai":
        return "outline"
      default:
        return "default"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={mockSeminar.gambar_banner}
          alt={mockSeminar.judul}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6 mb-8">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={mockSeminar.gambar}
                alt={mockSeminar.judul}
                fill
                className="object-cover rounded-2xl shadow-none"
              />
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {mockSeminar.judul}
              </h1>
              <Badge variant={getStatusBadgeVariant(mockSeminar.status)}>
                  {mockSeminar.status}
                </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{mockSeminar.tanggal}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{mockSeminar.lokasi}</span>
                </div>
                
              </div>
            </div>
        </div>

        <Card className='shadow-none'>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: mockSeminar.deskripsi }}
                />
              </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 shadow-none">
              <CardHeader>
                <CardTitle className="text-center">Registrasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold">
                      {mockSeminar.harga === 0 ? 'GRATIS' : formatCurrency(mockSeminar.harga)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sisa {remainingQuota} kursi
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={getStatusBadgeVariant(mockSeminar.status)}>
                      {mockSeminar.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kategori:</span>
                    <span className="font-medium">Workshop</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Diselenggarakan oleh:</span>
                    <span className="font-medium">PUSAMADA</span>
                  </div>
                </div>

                <Separator />

                {!isRegistered ? (
                  <Button 
                    onClick={handleRegister}
                    className="w-full"
                    size="lg"
                    disabled={mockSeminar.status === "Selesai" || remainingQuota <= 0}
                  >
                    {mockSeminar.status === "Selesai" 
                      ? "Acara Telah Selesai" 
                      : remainingQuota <= 0 
                        ? "Kuota Penuh"
                        : "Daftar Sekarang"
                    }
                  </Button>
                ) : (
                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="w-full py-2">
                      ✓ Anda sudah terdaftar
                    </Badge>
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat Tiket
                    </Button>
                  </div>
                )}

                {mockSeminar.link_acara && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={mockSeminar.link_acara} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link Acara
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

        
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Detail Acara
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-sm text-muted-foreground">Tanggal</p>
                        <p className="font-medium">
                          {mockSeminar.tanggal}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-sm text-muted-foreground">Waktu</p>
                        <p className="font-medium">
                          {mockSeminar.waktu_mulai} - {mockSeminar.waktu_selesai} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-sm text-muted-foreground">Lokasi</p>
                        <p className="font-medium">
                          {mockSeminar.lokasi}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-sm text-muted-foreground">Kuota</p>
                        <p className="font-medium">
                          {remainingQuota} dari {mockSeminar.kuota} peserta tersisa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeminarDetailPage