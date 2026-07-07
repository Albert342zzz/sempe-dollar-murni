"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BiShoppingBag } from "react-icons/bi";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";
import UserMenu from "./UserMenu";
import { useCart } from "@/context/CartContext";
import { useIsAdmin } from "@/lib/use-is-admin";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group relative py-1 transition-colors duration-200 ${
        isActive ? "text-terracotta" : "text-ink hover:text-terracotta"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-terracotta transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const pathname = usePathname();
  const cartActive = pathname === "/cart";
  const isAdmin = useIsAdmin();

  return (
    <>
      <header className="sticky top-0 z-30 h-20 w-full bg-cream text-sm tracking-widest text-ink shadow-md">
        {/* Nav area — right padding reserves space for the absolute UserMenu box */}
        <div className="flex h-full items-center justify-between px-4 md:pl-10 md:pr-36 lg:pl-24 lg:pr-48">
          {/* Left nav: Tentang · Produk · Kontak */}
          <nav className="hidden items-center gap-10 md:flex">
            <NavLink href="/about">TENTANG</NavLink>
            <NavLink href="/product">PRODUK</NavLink>
            <NavLink href="/contact">KONTAK</NavLink>
          </nav>

          {/* Logo — always viewport-centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={275}
                height={200}
                priority
                className="h-12 w-auto md:h-14 lg:h-16"
              />
            </Link>
          </div>

          {/* Right nav: Galeri · Cart (cart is hidden for admins) */}
          <nav className="hidden items-center gap-10 md:flex">
            <NavLink href="/gallery">GALERI</NavLink>
            {!isAdmin && (
              <Link
                href="/cart"
                aria-label="Keranjang Saya"
                className={`relative text-xl transition-colors duration-200 ${
                  cartActive
                    ? "text-terracotta"
                    : "text-ink hover:text-terracotta"
                }`}
              >
                <BiShoppingBag />
                {totalCount > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-medium text-white">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}
          </nav>
        </div>

        {/* UserMenu — corner box anchored to top-right of header */}
        <div className="absolute right-0 top-0 hidden h-full md:flex">
          <UserMenu />
        </div>
      </header>

      {/* Hamburger fades out when sidebar is open (sidebar × takes over) */}
      <div
        className={`fixed right-4 top-6 z-[60] md:hidden transition-opacity duration-300 ${
          menuOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <HamburgerButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>

      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
