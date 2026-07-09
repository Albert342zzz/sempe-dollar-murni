// Validate, resize, and compress a gallery image. Shared by the server action
// (replace), the upload route handler (/api/admin/gallery), and the seed.

import sharp from "sharp";

const GALLERY_MAX_BYTES = 3 * 1024 * 1024; // 3 MB (raw file limit)
const ALLOWED = /^image\/(jpeg|png|webp|gif)$/;

export type ReadImageResult =
  | { data: Uint8Array<ArrayBuffer>; mimeType: string }
  | { error: string };

// Resize (max 1600px, keep ratio) + compress to WebP. Makes the stored and
// served blob much smaller → a lighter gallery for both admin and guests.
export async function processGalleryImage(
  input: Uint8Array
): Promise<Uint8Array<ArrayBuffer>> {
  const out = await sharp(Buffer.from(input))
    .rotate() // auto-orient from EXIF (important for phone photos)
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const data = new Uint8Array(out.byteLength);
  data.set(out);
  return data;
}

export async function readImageFile(file: unknown): Promise<ReadImageResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File tidak ditemukan." };
  }
  if (!ALLOWED.test(file.type)) {
    return { error: "Format harus JPG, PNG, WEBP, atau GIF." };
  }
  if (file.size > GALLERY_MAX_BYTES) {
    return { error: "Ukuran gambar maksimal 3 MB." };
  }
  try {
    const raw = new Uint8Array(await file.arrayBuffer());
    const data = await processGalleryImage(raw);
    return { data, mimeType: "image/webp" };
  } catch {
    return { error: "Gagal memproses gambar." };
  }
}
