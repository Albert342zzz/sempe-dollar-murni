"use client";

import { useState, useTransition } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiUserPlus,
  FiMail,
  FiClock,
} from "react-icons/fi";
import {
  setUserRole,
  updateUserProfile,
  deleteUserProfile,
  inviteUser,
  deleteInvite,
} from "@/app/admin/users/actions";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";

type Role = "USER" | "ADMIN";

type UserProfile = {
  id: number;
  userId: string;
  email: string;
  nickname: string;
  phone: string;
  role: Role;
  createdAt: Date;
};

type UserInvite = {
  id: number;
  email: string;
  role: Role;
  createdAt: Date;
};

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const inputClass =
  "w-full rounded-lg border border-brown/20 bg-cream-soft px-2 py-1 text-sm text-ink outline-none focus:border-terracotta";

function RoleEditor({ user }: { user: UserProfile }) {
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Role;
    if (next === user.role) return;
    startTransition(async () => {
      const res = await setUserRole(user.userId, next);
      if (!res.ok && res.error) alert(res.error);
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.role === "ADMIN"
            ? "bg-terracotta/10 text-terracotta"
            : "bg-ink/5 text-ink/50"
        }`}
      >
        {user.role === "ADMIN" ? "Admin" : "User"}
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

function UserRow({ user }: { user: UserProfile }) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const res = await updateUserProfile(user.userId, nickname, phone);
      if (res.ok) {
        setEditing(false);
      } else {
        alert(res.error);
      }
    });
  }

  function handleCancel() {
    setNickname(user.nickname);
    setPhone(user.phone);
    setEditing(false);
  }

  function handleDelete() {
    if (!window.confirm(`Hapus pengguna "${user.nickname}"?`)) return;
    startTransition(async () => {
      const res = await deleteUserProfile(user.userId);
      if (!res.ok && res.error) alert(res.error);
    });
  }

  return (
    <tr className="hover:bg-cream-soft/50">
      <td className="px-5 py-3 text-sm text-ink/70">{user.email}</td>

      <td className="px-5 py-3">
        {editing ? (
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={inputClass}
            autoFocus
          />
        ) : (
          <span className="text-sm text-ink">{user.nickname}</span>
        )}
      </td>

      <td className="hidden px-5 py-3 md:table-cell">
        {editing ? (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            type="tel"
          />
        ) : (
          <span className="text-sm text-ink/60">{user.phone}</span>
        )}
      </td>

      <td className="hidden px-5 py-3 text-sm text-ink/50 lg:table-cell">
        {dateFmt.format(new Date(user.createdAt))}
      </td>

      <td className="px-5 py-3">
        <RoleEditor user={user} />
      </td>

      <td className="px-5 py-3 text-right">
        {editing ? (
          <div className="inline-flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={pending}
              title="Simpan"
              className="rounded-lg p-1.5 text-olive transition hover:bg-olive/10 disabled:opacity-50"
            >
              <FiCheck />
            </button>
            <button
              onClick={handleCancel}
              disabled={pending}
              title="Batal"
              className="rounded-lg p-1.5 text-ink/40 transition hover:bg-ink/10"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setEditing(true)}
              title="Edit"
              className="rounded-lg p-1.5 text-ink/40 transition hover:bg-ink/10 hover:text-ink"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              title="Hapus"
              className="rounded-lg p-1.5 text-ink/40 transition hover:bg-terracotta/10 hover:text-terracotta disabled:opacity-50"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function UserTable({ users }: { users: UserProfile[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brown/15 bg-cream">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-brown/10 text-left text-xs font-medium uppercase tracking-wider text-ink/40">
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Nama Panggilan</th>
            <th className="hidden px-5 py-3 md:table-cell">No. HP</th>
            <th className="hidden px-5 py-3 lg:table-cell">Terdaftar</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brown/10">
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add a user by email — they don't need to register first. On their first
// Google login the invite is consumed and the role applied automatically.
function InviteForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("ADMIN");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await inviteUser(email, role);
      if (res.ok) {
        if (res.promoted) {
          alert(
            `${email.trim().toLowerCase()} sudah punya akun — role-nya langsung diubah.`
          );
        }
        onDone();
      } else {
        setError(res.error ?? "Gagal menambahkan pengguna.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="invite-email" className="mb-1.5 block text-sm text-ink/70">
          Email
        </label>
        <input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@gmail.com"
          autoFocus
          className="w-full rounded-xl border border-brown/20 bg-cream-soft px-4 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta"
        />
        <p className="mt-1.5 text-xs text-ink/50">
          Gunakan email Google-nya. Saat login pertama kali, akun langsung
          dibuat dengan role di bawah.
        </p>
      </div>

      <div>
        <label htmlFor="invite-role" className="mb-1.5 block text-sm text-ink/70">
          Role
        </label>
        <select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full rounded-xl border border-brown/20 bg-cream-soft px-4 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta"
        >
          <option value="ADMIN">Admin — bisa mengelola seluruh situs</option>
          <option value="USER">User — pelanggan biasa</option>
        </select>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <button
        type="submit"
        disabled={!email.trim() || pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-2.5 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <Spinner className="h-4 w-4" />}
        {pending ? "Menambahkan..." : "Tambah"}
      </button>
    </form>
  );
}

function InviteRow({ invite }: { invite: UserInvite }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Batalkan undangan untuk "${invite.email}"?`)) return;
    startTransition(async () => {
      const res = await deleteInvite(invite.id);
      if (!res.ok && res.error) alert(res.error);
    });
  }

  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-ink/40">
        <FiMail />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink">{invite.email}</p>
        <p className="flex items-center gap-1 text-xs text-ink/50">
          <FiClock className="shrink-0" /> Menunggu login pertama
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          invite.role === "ADMIN"
            ? "bg-terracotta/10 text-terracotta"
            : "bg-ink/5 text-ink/50"
        }`}
      >
        {invite.role === "ADMIN" ? "Admin" : "User"}
      </span>
      <button
        onClick={handleDelete}
        disabled={pending}
        title="Batalkan undangan"
        className="shrink-0 rounded-lg p-1.5 text-ink/40 transition hover:bg-terracotta/10 hover:text-terracotta disabled:opacity-50"
      >
        <FiTrash2 />
      </button>
    </li>
  );
}

export default function UserManager({
  users,
  invites,
}: {
  users: UserProfile[];
  invites: UserInvite[];
}) {
  const [adding, setAdding] = useState(false);

  const admins = users.filter((u) => u.role === "ADMIN");
  const regulars = users.filter((u) => u.role === "USER");

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm text-white transition hover:bg-brown"
        >
          <FiUserPlus /> Tambah Pengguna
        </button>
      </div>

      {adding && (
        <Modal
          title="Tambah Pengguna"
          icon={<FiUserPlus />}
          onClose={() => setAdding(false)}
        >
          <InviteForm onDone={() => setAdding(false)} />
        </Modal>
      )}

      {invites.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/50">
            Undangan{" "}
            <span className="ml-1 rounded-full bg-gold/20 px-2 py-0.5 text-ink/60">
              {invites.length}
            </span>
          </h2>
          <ul className="divide-y divide-brown/10 rounded-2xl border border-brown/15 bg-cream">
            {invites.map((i) => (
              <InviteRow key={i.id} invite={i} />
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/50">
          Admin{" "}
          <span className="ml-1 rounded-full bg-terracotta/10 px-2 py-0.5 text-terracotta">
            {admins.length}
          </span>
        </h2>
        {admins.length > 0 ? (
          <UserTable users={admins} />
        ) : (
          <p className="text-sm text-ink/40">Tidak ada admin.</p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/50">
          User{" "}
          <span className="ml-1 rounded-full bg-ink/5 px-2 py-0.5 text-ink/50">
            {regulars.length}
          </span>
        </h2>
        {regulars.length > 0 ? (
          <UserTable users={regulars} />
        ) : (
          <p className="text-sm text-ink/40">Belum ada user terdaftar.</p>
        )}
      </div>
    </div>
  );
}
