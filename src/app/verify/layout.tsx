import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
			{children}
		</div>
	);
};

export default MainLayout;
