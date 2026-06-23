"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";

export type ActionState = { ok: boolean; error?: string };

export async function updatePrices(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const sizes = await prisma.size.findMany();
  for (const s of sizes) {
    const price = Number(formData.get(`price_${s.id}`));
    if (Number.isFinite(price) && price >= 0) {
      await prisma.size.update({
        where: { id: s.id },
        data: { price: Math.round(price) },
      });
    }
  }

  revalidatePath("/admin/products");
  return { ok: true };
}

export async function createFlavor(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const accent = String(formData.get("accent") ?? "#8c5a3c");
  const image =
    String(formData.get("image") ?? "").trim() || "/images/product3.png";

  if (!id || !name) return { ok: false, error: "ID dan nama wajib diisi." };
  if (!/^[a-z0-9-]+$/.test(id)) {
    return {
      ok: false,
      error: "ID hanya boleh huruf kecil, angka, dan tanda strip.",
    };
  }

  const exists = await prisma.flavor.findUnique({ where: { id } });
  if (exists) return { ok: false, error: `Rasa dengan ID "${id}" sudah ada.` };

  await prisma.flavor.create({
    data: { id, name, description, accent, image },
  });

  revalidatePath("/admin/products");
  return { ok: true };
}

export async function updateFlavor(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const accent = String(formData.get("accent") ?? "#8c5a3c");

  if (!name) return { ok: false, error: "Nama wajib diisi." };

  await prisma.flavor.update({
    where: { id },
    data: { name, description, accent },
  });

  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteFlavor(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");

  const usedInOrders = await prisma.orderItem.count({
    where: { flavorId: id },
  });
  if (usedInOrders > 0) {
    return {
      ok: false,
      error: "Tidak bisa dihapus: rasa ini ada di riwayat pesanan.",
    };
  }

  await prisma.flavor.delete({ where: { id } });

  revalidatePath("/admin/products");
  return { ok: true };
}
