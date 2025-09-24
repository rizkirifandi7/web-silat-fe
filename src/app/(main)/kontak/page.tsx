import React from "react";

const PageKontak = () => {
	return (
		<div className="bg-background min-h-dvh">
			<div className="container mx-auto px-4 py-16 md:py-24">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800">
						Hubungi Kami
					</h1>
					<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
						Punya pertanyaan atau ingin bergabung? Jangan ragu untuk mengirim
						pesan kepada kami.
					</p>
				</div>

				{/* Konten Utama */}
				<div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						{/* Kolom Informasi Kontak */}
						<div>
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Informasi Kontak
							</h2>
							<p className="text-gray-600 mb-6">
								Anda juga bisa mengunjungi kami langsung di alamat berikut atau
								menghubungi kami melalui telepon dan email.
							</p>
							<div className="space-y-4">
								<div className="flex items-start">
									<svg
										className="w-6 h-6 text-gray-700 mr-3 mt-1 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										></path>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
									<span className="text-gray-700">
										Jl. Padepokan Pencak Silat, No. 1, Jakarta Timur, Indonesia
									</span>
								</div>
								<div className="flex items-center">
									<svg
										className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										></path>
									</svg>
									<span className="text-gray-700">(021) 123-4567</span>
								</div>
								<div className="flex items-center">
									<svg
										className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
									<span className="text-gray-700">
										info@pencaksilatindonesia.com
									</span>
								</div>
							</div>
						</div>

						{/* Kolom Form Kontak */}
						<form className="space-y-6">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700"
								>
									Nama Lengkap
								</label>
								<input
									type="text"
									id="name"
									name="name"
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
									placeholder="John Doe"
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Alamat Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
									placeholder="anda@email.com"
								/>
							</div>
							<div>
								<label
									htmlFor="message"
									className="block text-sm font-medium text-gray-700"
								>
									Pesan Anda
								</label>
								<textarea
									id="message"
									name="message"
									rows={4}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
									placeholder="Tuliskan pesan Anda di sini..."
								></textarea>
							</div>
							<div>
								<button
									type="submit"
									className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
								>
									Kirim Pesan
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PageKontak;
