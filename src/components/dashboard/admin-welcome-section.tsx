"use client";

import { useUserContext } from "@/context/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { IconSparkles, IconSun, IconMoon } from "@tabler/icons-react";

export function AdminWelcomeSection() {
	const { user } = useUserContext();
	const currentHour = new Date().getHours();

	const getGreeting = () => {
		if (currentHour < 12) return { text: "Selamat Pagi", icon: IconSun };
		if (currentHour < 18) return { text: "Selamat Siang", icon: IconSun };
		return { text: "Selamat Malam", icon: IconMoon };
	};

	const greeting = getGreeting();
	const GreetingIcon = greeting.icon;

	return (
		<Card className="border-none shadow-none bg-gradient-to-br from-primary/10 via-primary/5 to-background">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<GreetingIcon className="h-5 w-5 text-primary" />
							<h2
								className="text-2xl font-bold tracking-tight"
								suppressHydrationWarning
							>
								{greeting.text}, {user?.nama || "Admin"}! 👋
							</h2>
						</div>
						<p className="text-muted-foreground">
							Berikut adalah ringkasan aktivitas hari ini.
						</p>
					</div>
					<div className="hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
						<IconSparkles className="h-8 w-8 text-primary" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
