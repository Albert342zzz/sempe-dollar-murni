"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiX,
  FiInfo,
  FiBox,
  FiPhone,
  FiImage,
  FiShoppingBag,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import { BiLogIn } from "react-icons/bi";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import { eloquia } from "@/lib/fonts";

type UserInfo = { email: string; name: string };

type Props = {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
};

const navItems = [
  { icon: FiInfo, label: "Tentang", href: "/about" },
  { icon: FiBox, label: "Produk", href: "/product" },
  { icon: FiPhone, label: "Kontak", href: "/contact" },
  { icon: FiImage, label: "Galeri", href: "/gallery" },
  { icon: FiShoppingBag, label: "Keranjang", href: "/cart" },
];

export default function MobileMenu({ menuOpen, setMenuOpen }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
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

  function close() {
    setMenuOpen(false);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/admin/logout").catch(() => {});
    setUser(null);
    setNickname(null);
    setIsAdmin(false);
    close();
    router.push("/");
    router.refresh();
  }

  const displayName = user ? (nickname ?? user.name.split(" ")[0]) : null;

  function navClass(href: string) {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return [
      "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200",
      active
        ? "bg-terracotta text-white shadow-sm"
        : "text-cream/60 hover:bg-cream/15 hover:text-cream hover:-translate-x-1 active:scale-95 active:bg-cream/20 active:text-cream",
    ].join(" ");
  }

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar — dark theme, slides from right */}
      <aside
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-ink shadow-2xl md:hidden",
          "transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Brand header */}
        <div className="relative flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta text-sm font-bold text-white shadow-sm">
            SD
          </div>
          <div>
            <p className={`${eloquia.className} text-[15px] leading-tight text-cream`}>
              Sempe Dollar
            </p>
            <p className="text-[11px] leading-none text-cream/40">Menu Utama</p>
          </div>
          <button
            onClick={close}
            aria-label="Tutup menu"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-cream/30 transition-colors hover:bg-cream/10 hover:text-cream active:bg-cream/20"
          >
            <FiX className="text-base" />
          </button>
        </div>

        <div className="mx-4 h-px bg-cream/10" />

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-cream/25">
            Menu
          </p>

          {navItems
            .filter((item) => !(isAdmin && item.href === "/cart"))
            .map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={navClass(item.href)}
              >
                <Icon
                  className={[
                    "shrink-0 text-base transition-transform duration-200",
                    !active && "group-hover:scale-110 group-active:scale-90",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <span>{item.label}</span>
                {item.href === "/cart" && totalCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-medium text-white">
                    {totalCount}
                  </span>
                )}
                {active && item.href !== "/cart" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / account section */}
        <div className="border-t border-cream/10 p-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-cream/25">
            Akun
          </p>

          {user && displayName ? (
            <>
              {/* User info */}
              <div className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">
                  {displayName[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-cream">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-cream/40">{user.email}</p>
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={close}
                  className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-terracotta transition-all duration-200 hover:-translate-x-1 hover:bg-terracotta/15 active:scale-95 active:bg-terracotta/20"
                >
                  <FiGrid className="shrink-0 text-base transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
                  Dashboard Admin
                </Link>
              )}

              {!isAdmin && (
                <Link
                  href="/my-orders"
                  onClick={close}
                  className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/60 transition-all duration-200 hover:-translate-x-1 hover:bg-cream/15 hover:text-cream active:scale-95 active:bg-cream/20 active:text-cream"
                >
                  <FiShoppingBag className="shrink-0 text-base transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
                  Pesanan Saya
                </Link>
              )}

              <button
                onClick={logout}
                className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/60 transition-all duration-200 hover:-translate-x-1 hover:bg-red-500/10 hover:text-red-400 active:scale-95 active:bg-red-500/15 active:text-red-400"
              >
                <FiLogOut className="shrink-0 text-base transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
                Keluar
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={close}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-brown active:scale-95 active:opacity-90"
            >
              <BiLogIn className="text-lg" />
              Masuk / Daftar
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
