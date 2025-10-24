"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Galeri } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";

const formSchema = z.object({
  judul: z.string().min(1, { message: "Judul tidak boleh kosong." }),
  deskripsi: z.string().min(1, { message: "Deskripsi tidak boleh kosong." }),
  gambar: z.any().optional(),
});

type GaleriFormValues = z.infer<typeof formSchema>;

interface GaleriFormProps {
  galeri?: Galeri;
  onSubmit: (formData: FormData) => Promise<void>;
  onSuccess: () => void;
}

export function GaleriForm({ galeri, onSubmit, onSuccess }: GaleriFormProps) {
  const [preview, setPreview] = useState<string | null>(galeri?.gambar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GaleriFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: galeri?.judul || "",
      deskripsi: galeri?.deskripsi || "",
      gambar: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("gambar", file);
    }
  };

  const handleSubmit = async (values: GaleriFormValues) => {
    const formData = new FormData();
    formData.append("judul", values.judul);
    formData.append("deskripsi", values.deskripsi);
    if (values.gambar instanceof File) {
      formData.append("gambar", values.gambar);
    }
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Judul gambar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi singkat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="gambar"
          render={() => (
            <FormItem>
              <FormLabel>Gambar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {preview && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="w-full h-auto rounded-md"
            />
          </div>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Mengirim..."
            : galeri
            ? "Simpan Perubahan"
            : "Tambah"}
        </Button>
      </form>
    </Form>
  );
}
