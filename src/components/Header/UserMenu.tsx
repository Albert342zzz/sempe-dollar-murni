"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiLogIn } from "react-icons/bi";
import { FiLogOut, FiShoppingBag, FiGrid } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";

type UserInfo = { email: string; name: string };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat pagi";
  if (h >= 11 && h < 15) return "Selamat siang";
  if (h >= 15 && h < 18) return "Selamat sore";
  return "Selamat malam";
}

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
    // Also clear admin JWT cookie so /admin is no longer accessible.
    await fetch("/api/admin/logout").catch(() => {});
    setUser(null);
    setNickname(null);
    setIsAdmin(false);
    setOpen(false);
    router.refresh();
  }

  // Not logged in — icon-only box in the corner
  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Masuk"
        className="group flex h-full min-w-[60px] flex-col items-center justify-center border-l border-brown/20 bg-cream px-5 transition-all duration-200 hover:bg-terracotta/10"
      >
        <BiLogIn className="text-xl text-ink/60 transition-colors duration-200 group-hover:text-terracotta" />
        <span className="mt-0.5 text-[9px] tracking-widest text-ink/40 transition-colors duration-200 group-hover:text-terracotta/70">
          MASUK
        </span>
      </Link>
    );
  }

  const displayName = nickname ?? user.name.split(" ")[0];
  const greeting = getGreeting();

  return (
    <div ref={ref} className="relative h-full">
      {/* Trigger: corner box with 2-line greeting */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Akun"
        className="group flex h-full flex-col items-start justify-center gap-0.5 border-l border-brown/20 bg-cream px-5 transition-all duration-200 hover:bg-terracotta/10"
      >
        <span className="text-[10px] leading-none text-ink/50 transition-colors duration-200 group-hover:text-terracotta/70">
          {greeting} kak,
        </span>
        <span className="text-sm font-semibold leading-none text-ink transition-colors duration-200 group-hover:text-terracotta">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-2xl border border-brown/15 bg-cream p-3 text-left shadow-lg">
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

          {!isAdmin && (
            <Link
              href="/my-orders"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink/80 transition hover:bg-cream-soft"
            >
              <FiShoppingBag /> Pesanan Saya
            </Link>
          )}
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
