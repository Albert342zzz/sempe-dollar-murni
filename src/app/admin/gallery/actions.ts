"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";

export type GalleryState = { ok: boolean; error?: string };

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED = /^image\/(jpeg|png|webp|gif)$/;

async function readImage(
  file: unknown
): Promise<{ data: Uint8Array<ArrayBuffer>; mimeType: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File tidak ditemukan." };
  }
  if (!ALLOWED.test(file.type)) {
    return { error: "Format harus JPG, PNG, WEBP, atau GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Ukuran gambar maksimal 3 MB." };
  }
  const data = new Uint8Array(await file.arrayBuffer());
  return { data, mimeType: file.type };
}

function revalidate() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

// Add a new photo to the gallery.
export async function addGalleryImage(formData: FormData): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const img = await readImage(formData.get("file"));
  if ("error" in img) return { ok: false, error: img.error };

  const alt = String(formData.get("alt") ?? "").trim() || "Foto galeri";
  const last = await prisma.galleryImage.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.galleryImage.create({
    data: {
      data: img.data,
      mimeType: img.mimeType,
      alt,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  revalidate();
  return { ok: true };
}

// Replace an entry's image (alt text and order stay the same).
export async function replaceGalleryImage(
  formData: FormData
): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { ok: false, error: "ID tidak valid." };

  const img = await readImage(formData.get("file"));
  if ("error" in img) return { ok: false, error: img.error };

  await prisma.galleryImage.update({
    where: { id },
    data: { data: img.data, mimeType: img.mimeType },
  });

  revalidate();
  return { ok: true };
}

// Update a photo's alt text (description).
export async function updateGalleryAlt(
  id: number,
  alt: string
): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  const clean = alt.trim();
  if (!clean) return { ok: false, error: "Deskripsi tidak boleh kosong." };
  await prisma.galleryImage.update({ where: { id }, data: { alt: clean } });
  revalidate();
  return { ok: true };
}

// Delete a photo.
export async function deleteGalleryImage(id: number): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  await prisma.galleryImage.delete({ where: { id } });
  revalidate();
  return { ok: true };
}

// Reorder a photo (swap sortOrder with its neighbor).
export async function moveGalleryImage(
  id: number,
  dir: "up" | "down"
): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const all = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return { ok: false, error: "Foto tidak ditemukan." };

  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { ok: true }; // already at the edge

  const a = all[idx];
  const b = all[swapIdx];
  await prisma.$transaction([
    prisma.galleryImage.update({
      where: { id: a.id },
      data: { sortOrder: b.sortOrder },
    }),
    prisma.galleryImage.update({
      where: { id: b.id },
      data: { sortOrder: a.sortOrder },
    }),
  ]);

  revalidate();
  return { ok: true };
}
