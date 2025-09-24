import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		"PUSAMADA",
		"Pencak Silat",
		"Silat",
		"Martial Arts",
		"Indonesian Martial Arts",
	],
	authors: [
		{
			name: "PUSAMADA",
			url: "https://pusamada.com",
		},
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
	manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(`${inter.className}
					text-foreground group/body overscroll-none  antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)] 
				`)}
			>
				<Toaster />
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ActiveThemeProvider>{children}</ActiveThemeProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
