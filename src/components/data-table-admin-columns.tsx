"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminData } from "@/lib/schema";
import { EditAdminDialog } from "./edit-admin-dialog";
import { DeleteAdminDialog } from "./delete-admin-dialog";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { IconDotsVertical } from "@tabler/icons-react";

export const columns: ColumnDef<AdminData>[] = [
	{
		accessorKey: "nama",
		header: "Nama",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => <Badge>{row.original.role}</Badge>,
	},
	{
		accessorKey: "no_telepon",
		header: "No. Telepon",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const admin = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<IconDotsVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<EditAdminDialog admin={admin as AdminData & { id: number }} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							<DeleteAdminDialog
								adminId={(admin as AdminData & { id: number }).id}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
