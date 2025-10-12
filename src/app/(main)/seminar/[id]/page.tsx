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
  gambar_banner: "/kujang-bg.png"
}

const SeminarDetailPage = () => {
  const [isRegistered, setIsRegistered] = useState(false)
  const [remainingQuota, setRemainingQuota] = useState(45)

  const handleRegister = () => {
    setIsRegistered(true)
    setRemainingQuota(prev => prev - 1)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockSeminar.judul,
          text: `Bergabunglah dengan workshop: ${mockSeminar.judul}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link berhasil disalin!')
    }
  }

  const goBack = () => {
    window.history.back()
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
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <ShareIcon className="h-4 w-4 mr-2" />
              Bagikan
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section with Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={mockSeminar.gambar_banner}
          alt={mockSeminar.judul}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Badge 
              variant={getStatusBadgeVariant(mockSeminar.status)}
              className="mb-4"
            >
              {mockSeminar.status}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {mockSeminar.judul}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              Bergabunglah dengan kami dalam workshop yang akan membuka wawasan Anda tentang seni bela diri tradisional Indonesia
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Detail Acara
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Tanggal</p>
                        <p className="text-sm text-muted-foreground">
                          {mockSeminar.tanggal}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Waktu</p>
                        <p className="text-sm text-muted-foreground">
                          {mockSeminar.waktu_mulai} - {mockSeminar.waktu_selesai} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Lokasi</p>
                        <p className="text-sm text-muted-foreground">
                          {mockSeminar.lokasi}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Kuota</p>
                        <p className="text-sm text-muted-foreground">
                          {remainingQuota} dari {mockSeminar.kuota} peserta tersisa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Workshop</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: mockSeminar.deskripsi }}
                />
              </CardContent>
            </Card>

           

            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-center">Registrasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSignIcon className="h-4 w-4" />
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

        

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">PUSAMADA Indonesia</p>
                  <p className="text-sm text-muted-foreground">
                    Jl. Pencak Silat No. 123<br />
                    Jakarta Selatan, DKI Jakarta
                  </p>
                </div>
                <div>
                  <p className="font-medium">Hubungi Kami</p>
                  <p className="text-sm text-muted-foreground">
                    Email: info@pusamada.com<br />
                    WhatsApp: +62 812-3456-7890
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Hubungi Penyelenggara
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeminarDetailPage