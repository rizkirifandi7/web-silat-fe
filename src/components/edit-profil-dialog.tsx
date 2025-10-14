"use client"
import { useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"
import Resizer from "react-image-file-resizer"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface User {
  id: number;
  nama: string;
  email: string;
  foto: string;
  role: string;
  id_token: string;
  createdAt: string;
  updatedAt: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  agama: string;
  jenis_kelamin: string;
  no_telepon: string;
  angkatan_unit: string;
  status_keanggotaan: string;
  tingkatan_sabuk: string;
  status_perguruan: string;
}

interface EditProfilDialogProps {
  onEditSuccess?: () => void;
}

export function EditProfilDialog({ onEditSuccess }: EditProfilDialogProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Photo editing states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const token = Cookies.get("token");

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/anggota/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Gagal memuat data profil");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !user) return;

    const formData = new FormData(e.currentTarget);
    
    // Add photo if selected
    if (selectedFile) {
      formData.append("foto", selectedFile);
    }
    
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/anggota/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profil berhasil diperbarui");
      setIsOpen(false);
      onEditSuccess?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, fetchUserData]);

  // Reset photo states when dialog opens with user data
  useEffect(() => {
    if (user && isOpen) {
      const getPhotoUrl = (foto: string) => {
        if (!foto) return null;
        // If foto is already a full URL (starts with http), use it directly
        if (foto.startsWith('http')) {
          return foto;
        }
        // Otherwise, construct the local API URL
        return `${process.env.NEXT_PUBLIC_API_URL}/anggota/${user.id}/${foto}`;
      };
      
      setFotoPreview(getPhotoUrl(user.foto || ""));
      setShowCrop(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setImageSrc(null);
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Photo handling functions
  const onCropComplete = (
    croppedArea: { width: number; height: number; x: number; y: number },
    croppedAreaPixels: { width: number; height: number; x: number; y: number }
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = (
    imageSrc: string,
    crop: { width: number; height: number; x: number; y: number }
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Failed to get canvas context"));
        }

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error("Failed to create blob"));
          }
          resolve(URL.createObjectURL(blob));
        }, "image/jpeg");
      };
      image.onerror = (error) => reject(error);
    });
  };

  const handleCropApply = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        Resizer.imageFileResizer(
          await (await fetch(croppedImage)).blob(),
          300,
          300,
          "JPEG",
          80,
          0,
          (uri) => {
            if (typeof uri === "string") {
              setFotoPreview(uri);
              setShowCrop(false);
              fetch(uri)
                .then((res) => res.blob())
                .then((blob) => {
                  const file = new File([blob], "resized-image.jpg", {
                    type: "image/jpeg",
                  });
                  setSelectedFile(file);
                });
            }
          },
          "base64"
        );
      } catch (error) {
        console.error("Error cropping image:", error);
        toast.error("Gagal memotong gambar.");
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="" asChild>
        <Button className="w-full" variant="default">Edit Profil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>
            Ubah informasi profil Anda di sini. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : user ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Photo Upload Section */}
              <div className="grid gap-3">
                <Label>Foto Profil</Label>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={user.foto?.startsWith('http') ? user.foto : `${process.env.NEXT_PUBLIC_API_URL}/anggota/${user.id}/${user.foto}`} 
                      alt={user.nama} 
                    />
                    <AvatarFallback className="text-2xl">
                      {user.nama?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Image Cropper Modal */}
              {showCrop && imageSrc && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Crop Foto</h3>
                    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        type="button" 
                        onClick={handleCropApply}
                        className="flex-1"
                      >
                        Terapkan
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowCrop(false)}
                        className="flex-1"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input 
                    id="nama" 
                    name="nama" 
                    defaultValue={user.nama || ""} 
                    required 
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    defaultValue={user.email || ""} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input 
                    id="tempat_lahir" 
                    name="tempat_lahir" 
                    defaultValue={user.tempat_lahir || ""} 
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input 
                    id="tanggal_lahir" 
                    name="tanggal_lahir" 
                    type="date"
                    defaultValue={formatDateForInput(user.tanggal_lahir)} 
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="alamat">Alamat</Label>
                <Input 
                  id="alamat" 
                  name="alamat" 
                  defaultValue={user.alamat || ""} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="agama">Agama</Label>
                  <Select name="agama" defaultValue={user.agama || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Kristen">Kristen</SelectItem>
                      <SelectItem value="Katolik">Katolik</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                  <Select name="jenis_kelamin" defaultValue={user.jenis_kelamin || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

                <div className="grid gap-3">
                  <Label htmlFor="no_telepon">No. Telepon</Label>
                  <Input 
                    id="no_telepon" 
                    name="no_telepon" 
                    defaultValue={user.no_telepon || ""} 
                  />
                </div>

            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Gagal memuat data profil</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
