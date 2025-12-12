import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "www.google.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "flowbite.s3.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "placehold.co",
			}
		],
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
	},
};

export default nextConfig;
