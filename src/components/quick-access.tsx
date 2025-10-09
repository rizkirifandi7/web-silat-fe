"use client";

import { Button } from "@/components/ui/button";
import { IconUserPlus, IconBook, IconPhoto } from "@tabler/icons-react";

export function QuickAccess() {
	return (
		<div className="flex gap-4 px-4 md:px-6">
			<Button>
				<IconUserPlus className="mr-2 h-4 w-4" />
				Tambah Anggota
			</Button>
			<Button>
				<IconBook className="mr-2 h-4 w-4" />
				Tambah Materi
			</Button>
			<Button>
				<IconPhoto className="mr-2 h-4 w-4" />
				Tambah Galeri
			</Button>
		</div>
	);
}
