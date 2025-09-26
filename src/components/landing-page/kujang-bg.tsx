import React from "react";
import Image from "next/image";

const Kujang = () => {
	return (
		<div>
			<div className="pointer-events-none absolute bottom-10 -left-30 opacity-5">
				<Image
					src="/kujang-bg.png"
					alt="Background Pattern"
					width={850}
					height={850}
					className="rotate-45"
					priority
				/>
			</div>
			{/* Kujang Background Right */}
			<div className="pointer-events-none absolute bottom-10 -right-30 opacity-5">
				<Image
					src="/kujang-bg.png"
					alt="Background Pattern"
					width={850}
					height={850}
					className="-rotate-45 scale-x-[-1]"
					priority
				/>
			</div>
		</div>
	);
};

export default Kujang;
