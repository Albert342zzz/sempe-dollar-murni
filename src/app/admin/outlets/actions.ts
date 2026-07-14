"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";

export type OutletState = { ok: boolean; error?: string };

function revalidate() {
  revalidatePath("/admin/outlets");
  revalidatePath("/contact");
}

export async function addOutlet(formData: FormData): Promise<OutletState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  if (!name || !address) return { ok: false, error: "Nama & alamat wajib diisi." };

  await prisma.outlet.create({ data: { name, address } });
  revalidate();
  return { ok: true };
}

export async function updateOutlet(
  id: number,
  name: string,
  address: string
): Promise<OutletState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  const n = name.trim();
  const a = address.trim();
  if (!n || !a) return { ok: false, error: "Nama & alamat wajib diisi." };

  await prisma.outlet.update({ where: { id }, data: { name: n, address: a } });
  revalidate();
  return { ok: true };
}

export async function deleteOutlet(id: number): Promise<OutletState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  await prisma.outlet.delete({ where: { id } });
  revalidate();
  return { ok: true };
}
