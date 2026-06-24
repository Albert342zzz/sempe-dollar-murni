"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiLogIn } from "react-icons/bi";
import { FiLogOut, FiShoppingBag, FiGrid } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";

type UserInfo = { email: string; name: string };

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const toInfo = (u: {
      email?: string;
      user_metadata?: Record<string, unknown>;
    }): UserInfo => ({
      email: u.email ?? "",
      name:
        (u.user_metadata?.full_name as string) ??
        (u.user_metadata?.name as string) ??
        u.email ??
        "Akun",
    });

    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user ? toInfo(data.user) : null));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toInfo(session.user) : null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setNickname(null);
      setIsAdmin(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        setNickname(p?.nickname ?? null);
        setIsAdmin(p?.role === "ADMIN");
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setNickname(null);
    setIsAdmin(false);
    setOpen(false);
    router.refresh();
  }

  if (!user) {
    return (
      <Link href="/login" className="text-xl" aria-label="Masuk">
        <BiLogIn />
      </Link>
    );
  }

  const displayName = nickname ?? user.name.split(" ")[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Akun"
        className="rounded-full bg-terracotta/10 px-3 py-1.5 text-sm font-medium text-terracotta transition hover:bg-terracotta/20"
      >
        Halo kak, {displayName}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-56 rounded-2xl border border-brown/15 bg-cream p-3 text-left shadow-lg">
          <p className="truncate px-2 text-sm font-medium text-ink">
            {displayName}
          </p>
          <p className="truncate px-2 text-xs text-ink/50">{user.email}</p>

          <div className="my-2 border-t border-brown/10" />

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-terracotta transition hover:bg-cream-soft"
            >
              <FiGrid /> Dashboard Admin
            </Link>
          )}

          <Link
            href="/my-orders"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink/80 transition hover:bg-cream-soft"
          >
            <FiShoppingBag /> Pesanan Saya
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink/80 transition hover:bg-cream-soft"
          >
            <FiLogOut /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}
