"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Produk",
  "/admin/orders": "Pesanan",
  "/admin/reports": "Laporan",
  "/admin/gallery": "Galeri",
  "/admin/users": "Pengguna",
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <div className="flex min-h-screen bg-cream-soft">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 bg-ink px-4 shadow-lg md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="rounded-lg p-1.5 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <FiMenu className="text-xl" />
        </button>
        <span className="text-sm font-medium tracking-wide text-cream">{title}</span>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <AdminSidebar menuOpen={open} onClose={() => setOpen(false)} />

      {/* Page content — pt-14 clears the fixed mobile topbar */}
      <main className="flex-1 overflow-x-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
