"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiArrowLeft,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { eloquia } from "@/lib/fonts";

const nav = [
  { icon: FiGrid, label: "Dashboard", href: "/admin" },
  { icon: FiBox, label: "Produk", href: "/admin/products" },
  { icon: FiShoppingBag, label: "Pesanan", href: "/admin/orders" },
  { icon: FiUsers, label: "Pengguna", href: "/admin/users" },
];

type Props = {
  menuOpen?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({ menuOpen = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink shadow-2xl",
        "transition-transform duration-300 ease-in-out",
        menuOpen ? "translate-x-0" : "-translate-x-full",
        "md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none",
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
          <p className="text-[11px] leading-none text-cream/40">Panel Admin</p>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          aria-label="Tutup menu"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-cream/30 transition-colors hover:bg-cream/10 hover:text-cream md:hidden"
        >
          <FiX className="text-base" />
        </button>
      </div>

      <div className="mx-4 h-px bg-cream/10" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-cream/25">
          Menu
        </p>

        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200",
                active
                  ? "bg-terracotta text-white shadow-sm"
                  : "text-cream/60 hover:translate-x-1 hover:bg-cream/15 hover:text-cream active:scale-95 active:bg-cream/20 active:text-cream",
              ].join(" ")}
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
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="space-y-0.5 border-t border-cream/10 p-3">
        <Link
          href="/"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/50 transition-all duration-200 hover:translate-x-1 hover:bg-cream/15 hover:text-cream active:scale-95 active:bg-cream/20 active:text-cream"
        >
          <FiArrowLeft className="shrink-0 text-base transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
          Kembali ke Situs
        </Link>
        <a
          href="/api/admin/logout"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/50 transition-all duration-200 hover:translate-x-1 hover:bg-red-500/10 hover:text-red-400 active:scale-95 active:bg-red-500/15 active:text-red-400"
        >
          <FiLogOut className="shrink-0 text-base transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
          Keluar
        </a>
      </div>
    </aside>
  );
}
