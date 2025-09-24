import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Navbar />
			<div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default MainLayout;
