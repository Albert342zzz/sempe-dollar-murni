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
} from "react-icons/fi";
import { eloquia } from "@/lib/fonts";

const nav = [
  { icon: FiGrid, label: "Dashboard", href: "/admin" },
  { icon: FiBox, label: "Produk", href: "/admin/products" },
  { icon: FiShoppingBag, label: "Pesanan", href: "/admin/orders" },
  { icon: FiUsers, label: "Pengguna", href: "/admin/users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink text-cream/70 md:flex">
      <div className="p-6">
        <p className={`${eloquia.className} text-xl text-cream`}>Sempe Dollar</p>
        <p className="text-xs text-cream/50">Panel Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.href !== "#" && pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                active
                  ? "bg-terracotta text-white"
                  : "hover:bg-cream/10 hover:text-cream"
              }`}
            >
              <Icon className="text-base" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-cream/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition hover:bg-cream/10 hover:text-cream"
        >
          <FiArrowLeft className="text-base" />
          Kembali ke Situs
        </Link>
        <a
          href="/api/admin/logout"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition hover:bg-cream/10 hover:text-cream"
        >
          <FiLogOut className="text-base" />
          Keluar
        </a>
      </div>
    </aside>
  );
}
