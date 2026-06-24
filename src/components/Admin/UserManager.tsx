"use client";

import { useTransition } from "react";
import { setUserRole } from "@/app/admin/users/actions";

type UserProfile = {
  id: number;
  userId: string;
  email: string;
  nickname: string;
  phone: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
};

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function RoleEditor({ user }: { user: UserProfile }) {
  const [pending, startTransition] = useTransition();
  const isAdmin = user.role === "ADMIN";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as "USER" | "ADMIN";
    if (next === user.role) return;
    startTransition(async () => {
      const res = await setUserRole(user.userId, next);
      if (!res.ok && res.error) alert(res.error);
    });
  }

  return (
    <div className="inline-flex items-center justify-end gap-2">
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isAdmin
            ? "bg-terracotta/10 text-terracotta"
            : "bg-ink/5 text-ink/50"
        }`}
      >
        {isAdmin ? "Admin" : "User"}
      </span>
      <select
        value={user.role}
        onChange={onChange}
        disabled={pending}
        aria-label={`Ubah role ${user.nickname}`}
        className="rounded-lg border border-brown/20 bg-cream px-2 py-1 text-xs text-ink outline-none transition focus:border-terracotta disabled:opacity-50"
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
  );
}

export default function UserManager({ users }: { users: UserProfile[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
        Belum ada pengguna terdaftar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brown/15 bg-cream">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brown/10 text-left text-xs font-medium uppercase tracking-wider text-ink/40">
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Nama Panggilan</th>
            <th className="hidden px-5 py-3 md:table-cell">No. HP</th>
            <th className="hidden px-5 py-3 lg:table-cell">Terdaftar</th>
            <th className="px-5 py-3 text-right">Role / Ubah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brown/10">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-cream-soft/50">
              <td className="px-5 py-3 text-ink">{u.email}</td>
              <td className="px-5 py-3 text-ink/80">{u.nickname}</td>
              <td className="hidden px-5 py-3 text-ink/60 md:table-cell">
                {u.phone}
              </td>
              <td className="hidden px-5 py-3 text-ink/50 lg:table-cell">
                {dateFmt.format(new Date(u.createdAt))}
              </td>
              <td className="px-5 py-3 text-right">
                <RoleEditor user={u} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
