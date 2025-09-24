import React from "react";

const Footer = () => {
	return (
		<footer className="flex justify-center items-center border-t py-4 text-sm text-muted-foreground animate-in fade-in duration-700 [animation-delay:400ms]">
			© {new Date().getFullYear()} PUSAMADA. All rights reserved.
		</footer>
	);
};

export default Footer;
