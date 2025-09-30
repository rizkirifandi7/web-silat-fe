import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
	return (
		<footer className="bg-white dark:bg-gray-900">
			<div className="mx-auto w-full max-w-5xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between gap-50">
					<div className="mb-6 md:mb-0 w-1/2">
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
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
							alias obcaecati blanditiis dolorum magnam dolores deserunt fugit
							consequuntur dolorem saepe!
						</p>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 w-full">
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Link
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
									<a
										href="https://github.com/themesberg/flowbite"
										className="hover:underline "
									>
										Instagram
									</a>
								</li>
								<li className="mb-2">
									<a
										href="https://discord.gg/4eeurUVvTy"
										className="hover:underline"
									>
										Facebook
									</a>
								</li>
								<li className="mb-2">
									<a
										href="https://discord.gg/4eeurUVvTy"
										className="hover:underline"
									>
										Youtube
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<div className="sm:flex justify-center">
					<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
						2025{" "}
						<a href="https://pusamadaind.com/" className="hover:underline">
							Pusaka Mande Muda Indonesia
						</a>
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
