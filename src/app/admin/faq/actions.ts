"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";

export type FaqState = { ok: boolean; error?: string };

function revalidate() {
  revalidatePath("/admin/faq");
  revalidatePath("/contact");
}

function clean(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
  };
}

export async function addFaq(formData: FormData): Promise<FaqState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  const { question, answer } = clean(formData);
  if (!question || !answer)
    return { ok: false, error: "Pertanyaan & jawaban wajib diisi." };

  // New items go to the end (highest sortOrder + 1).
  const last = await prisma.faq.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.faq.create({
    data: { question, answer, sortOrder: (last?.sortOrder ?? 0) + 1 },
  });
  revalidate();
  return { ok: true };
}

export async function updateFaq(
  id: number,
  formData: FormData
): Promise<FaqState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  const { question, answer } = clean(formData);
  if (!question || !answer)
    return { ok: false, error: "Pertanyaan & jawaban wajib diisi." };

  await prisma.faq.update({ where: { id }, data: { question, answer } });
  revalidate();
  return { ok: true };
}

export async function deleteFaq(id: number): Promise<FaqState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  await prisma.faq.delete({ where: { id } });
  revalidate();
  return { ok: true };
}

// Move an FAQ up or down by swapping sortOrder with its neighbor.
export async function moveFaq(
  id: number,
  direction: "up" | "down"
): Promise<FaqState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const all = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  const idx = all.findIndex((f) => f.id === id);
  if (idx === -1) return { ok: false, error: "FAQ tidak ditemukan." };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { ok: true }; // already at edge

  const a = all[idx];
  const b = all[swapIdx];
  await prisma.$transaction([
    prisma.faq.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.faq.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);
  revalidate();
  return { ok: true };
}
