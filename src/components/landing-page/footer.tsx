import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-white dark:bg-gray-900">
			<hr />
			<div className="mx-auto w-full max-w-6xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between gap-8">
					<div className="mb-10 md:mb-0 md:w-1/2">
						<Link href="https://pusamadaind.com/" className="flex items-center">
							<Image
								src="/pusamada-logo.png"
								className="h-8 w-8 me-3"
								width={32}
								height={32}
								alt="PUSAMADA Logo"
							/>
							<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
								PUSAMADA
							</span>
						</Link>

						<p className="mt-4 text-gray-500 dark:text-gray-400 font-medium max-w-xs text-justify">
							Pusaka Mande Muda adalah organisasi yang berdedikasi untuk
							melestarikan dan mempromosikan seni bela diri Pencak Silat
							tradisional Indonesia.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:gap-6 w-full md:w-1/2">
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Menu
							</h2>
							<ul className="text-gray-500 dark:text-gray-400 font-medium">
								<li className="mb-2">
									<Link href="/" className="hover:underline">
										Beranda
									</Link>
								</li>
								<li className="mb-2">
									<Link href="/tentang" className="hover:underline">
										Tentang
									</Link>
								</li>
								<li className="mb-2">
									<Link href="/galeri" className="hover:underline">
										Galeri
									</Link>
								</li>
								<li className="mb-2">
									<Link href="/kontak" className="hover:underline">
										Kontak
									</Link>
								</li>
								<li className="mb-2">
									<Link href="/seminar" className="hover:underline">
										Seminar
									</Link>
								</li>
								<li className="mb-2">
									<Link href="/katalog" className="hover:underline">
										Katalog
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Media Sosial
							</h2>
							<ul className="text-gray-500 dark:text-gray-400 font-medium">
								<li className="mb-2">
									<Link href="#" className="hover:underline">
										Instagram
									</Link>
								</li>
								<li className="mb-2">
									<Link href="#" className="hover:underline">
										Facebook
									</Link>
								</li>
								<li className="mb-2">
									<Link href="#" className="hover:underline">
										Youtube
									</Link>
								</li>
								<li className="mb-2">
									<Link href="#" className="hover:underline">
										Tiktok
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<div className="sm:flex sm:items-center sm:justify-between">
					<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
						© 2025{" "}
						<a href="https://pusamadaind.com/" className="hover:underline">
							Pusaka Mande Muda Indonesia
						</a>
						. All Rights Reserved.
					</span>
					<div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5 rtl:space-x-reverse">
						<Link
							href="#"
							className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<Facebook className="w-5 h-5" />
							<span className="sr-only">Facebook page</span>
						</Link>
						<Link
							href="#"
							className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<Instagram className="w-5 h-5" />
							<span className="sr-only">Instagram page</span>
						</Link>
						<Link
							href="#"
							className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<Youtube className="w-5 h-5" />
							<span className="sr-only">YouTube channel</span>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
