import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import UserManager from "@/components/Admin/UserManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengguna",
};

export default async function UsersPage() {
  const [users, invites] = await Promise.all([
    prisma.userProfile.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.userInvite.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-ink">Pengguna</h1>
      <p className="mt-1 text-sm text-ink/50">
        Kelola akun pelanggan dan hak akses admin.
      </p>

      <div className="mt-6">
        <UserManager users={users} invites={invites} />
      </div>
    </div>
  );
}
