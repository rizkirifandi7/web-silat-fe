"use client";
import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="relative flex min-h-screen flex-col bg-background">
				<Navbar />
				<div className="relative min-h-[calc(100svh-4rem)] overflow-hidden flex-1">
					{children}
				</div>
				<Footer />
			</div>
		</QueryClientProvider>
	);
};

export default MainLayout;
