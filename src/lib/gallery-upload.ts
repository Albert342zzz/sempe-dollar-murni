// Validate and read a gallery image file. Shared by the server action
// (replace) and the upload route handler (/api/admin/gallery).

const GALLERY_MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED = /^image\/(jpeg|png|webp|gif)$/;

export type ReadImageResult =
  | { data: Uint8Array<ArrayBuffer>; mimeType: string }
  | { error: string };

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
  const data = new Uint8Array(await file.arrayBuffer());
  return { data, mimeType: file.type };
}
