"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";
import { readImageFile } from "@/lib/gallery-upload";

export type GalleryState = { ok: boolean; error?: string };

function revalidate() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

// Replace an entry's image (alt text and order stay the same).
export async function replaceGalleryImage(
  formData: FormData
): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { ok: false, error: "ID tidak valid." };

  const img = await readImageFile(formData.get("file"));
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

// Save the new order (from drag-and-drop) in a SINGLE SQL statement:
// one round-trip, atomic, and it leaves updatedAt untouched (image cache URLs stay valid).
export async function reorderGalleryImages(
  ids: number[]
): Promise<GalleryState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  const clean = ids.filter((id) => Number.isInteger(id));
  if (clean.length === 0) return { ok: true };

  // Build: UPDATE ... FROM (VALUES ($1,$2),($3,$4),...) v(id, ord) WHERE g.id = v.id
  const valuesSql = clean
    .map((_, i) => `($${i * 2 + 1}::int, $${i * 2 + 2}::int)`)
    .join(", ");
  const params = clean.flatMap((id, i) => [id, i]);

  await prisma.$executeRawUnsafe(
    `UPDATE "GalleryImage" AS g
     SET "sortOrder" = v.ord
     FROM (VALUES ${valuesSql}) AS v(id, ord)
     WHERE g.id = v.id`,
    ...params
  );

  revalidate();
  return { ok: true };
}
