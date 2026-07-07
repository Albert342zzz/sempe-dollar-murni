"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";

type Status = "BARU" | "DIPROSES" | "SELESAI" | "DIBATALKAN";
const VALID: Status[] = ["BARU", "DIPROSES", "SELESAI", "DIBATALKAN"];

export async function updateOrderStatus(
  id: number,
  status: Status
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  if (!VALID.includes(status)) {
    return { ok: false, error: "Status tidak valid." };
  }

  await prisma.order.update({ where: { id }, data: { status } });

  revalidatePath("/admin/orders");
  revalidatePath("/admin"); // dashboard also shows the status
  return { ok: true };
}
