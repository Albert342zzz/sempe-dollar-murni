"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

type Role = "USER" | "ADMIN";
type Result = { ok: boolean; error?: string };

// Fetch the currently signed-in admin's profile (used for self-action guards).
async function getCurrentProfile() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return session?.email
    ? prisma.userProfile.findFirst({
        where: { email: session.email as string },
      })
    : null;
}

export async function setUserRole(userId: string, role: Role): Promise<Result> {
  if (!(await isAdmin())) return { ok: false, error: "Akses ditolak." };

  // Prevent an admin from demoting their own role.
  const current = await getCurrentProfile();
  if (current?.userId === userId && role === "USER") {
    return {
      ok: false,
      error: "Kamu tidak bisa menghapus role admin milikmu sendiri.",
    };
  }

  await prisma.userProfile.update({ where: { userId }, data: { role } });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserProfile(
  userId: string,
  nickname: string,
  phone: string
): Promise<Result> {
  if (!(await isAdmin())) return { ok: false, error: "Akses ditolak." };

  if (!nickname.trim() || !phone.trim()) {
    return { ok: false, error: "Nama panggilan dan nomor HP wajib diisi." };
  }

  await prisma.userProfile.update({
    where: { userId },
    data: { nickname: nickname.trim(), phone: phone.trim() },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUserProfile(userId: string): Promise<Result> {
  if (!(await isAdmin())) return { ok: false, error: "Akses ditolak." };

  // Prevent an admin from deleting their own account.
  const current = await getCurrentProfile();
  if (current?.userId === userId) {
    return { ok: false, error: "Kamu tidak bisa menghapus akunmu sendiri." };
  }

  await prisma.userProfile.delete({ where: { userId } });

  revalidatePath("/admin/users");
  return { ok: true };
}
