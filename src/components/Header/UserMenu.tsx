"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiLogIn } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";

type UserInfo = { email: string; name: string; avatar?: string };

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
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
      avatar: u.user_metadata?.avatar_url as string | undefined,
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

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Akun"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-terracotta text-sm font-medium text-white"
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-56 rounded-2xl border border-brown/15 bg-cream p-3 text-left shadow-lg">
          <p className="truncate px-2 text-sm font-medium text-ink">
            {user.name}
          </p>
          <p className="truncate px-2 text-xs text-ink/50">{user.email}</p>
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink/80 transition hover:bg-cream-soft"
          >
            <FiLogOut /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}
