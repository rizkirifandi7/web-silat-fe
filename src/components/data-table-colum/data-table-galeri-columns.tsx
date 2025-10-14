"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Galeri } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

export type GaleriTableHandlers = {
  onEdit: (galeri: Galeri) => void;
  onDelete: (galeri: Galeri) => void;
};

export const getGaleriColumns = ({
  onEdit,
  onDelete,
}: GaleriTableHandlers): ColumnDef<Galeri>[] => [
  {
    accessorKey: "gambar",
    header: "Gambar",
    cell: ({ row }) => (
      <Image
        src={row.original.gambar || "/no-image.jpg"}
        alt={row.original.judul}
        width={80}
        height={80}
        priority
        className="rounded-md"
      />
    ),
  },
  {
    accessorKey: "judul",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Judul
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("judul")}</div>,
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("deskripsi")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => onDelete(row.original)}
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
