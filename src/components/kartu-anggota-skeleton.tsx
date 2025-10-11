import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KartuAnggotaSkeleton() {
	return (
		<Card className="p-4 space-y-3">
			<Skeleton className="h-40 w-full rounded-md" />
			<div className="space-y-2">
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-4 w-1/4" />
			</div>
		</Card>
	);
}

export function FilterSkeleton() {
	return (
		<Card className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 shadow-none">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</Card>
	);
}
