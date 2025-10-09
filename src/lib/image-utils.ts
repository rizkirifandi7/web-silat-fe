import { Area } from "react-easy-crop";
import Resizer from "react-image-file-resizer";

/**
 * Membuat gambar yang dipotong dari gambar sumber dan area potong.
 * @param {string} imageSrc - URL sumber gambar.
 * @param {Area} crop - Area yang akan dipotong.
 * @returns {Promise<Blob>} Blob dari gambar yang telah dipotong.
 */
export const getCroppedImg = (imageSrc: string, crop: Area): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = imageSrc;
		image.crossOrigin = "anonymous";
		image.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return reject(new Error("Gagal mendapatkan konteks kanvas"));
			}

			canvas.width = crop.width;
			canvas.height = crop.height;

			ctx.drawImage(
				image,
				crop.x,
				crop.y,
				crop.width,
				crop.height,
				0,
				0,
				crop.width,
				crop.height
			);

			canvas.toBlob((blob) => {
				if (!blob) {
					return reject(new Error("Gagal membuat blob dari kanvas"));
				}
				resolve(blob);
			}, "image/jpeg");
		};
		image.onerror = (error) => reject(error);
	});
};

/**
 * Mengubah ukuran gambar menjadi dimensi yang ditentukan.
 * @param {Blob} file - File gambar (dalam bentuk Blob) yang akan diubah ukurannya.
 * @param {number} width - Lebar target.
 * @param {number} height - Tinggi target.
 * @returns {Promise<File>} File gambar yang telah diubah ukurannya.
 */
export const resizeImage = (
	file: Blob,
	width: number,
	height: number
): Promise<File> => {
	return new Promise((resolve) => {
		Resizer.imageFileResizer(
			file,
			width,
			height,
			"JPEG",
			90, // Kualitas
			0, // Rotasi
			(uri) => {
				// Konversi URI (bisa jadi base64 atau blob URL) kembali ke File
				fetch(uri as string)
					.then((res) => res.blob())
					.then((blob) => {
						const resizedFile = new File([blob], "cropped-image.jpg", {
							type: "image/jpeg",
						});
						resolve(resizedFile);
					});
			},
			"base64" // Tipe output dari Resizer
		);
	});
};