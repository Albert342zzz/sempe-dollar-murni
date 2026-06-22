"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BiShoppingBag, BiLogIn } from "react-icons/bi";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <>
      <header
        className="sticky w-full top-0 z-30 h-20 flex items-center text-sm tracking-widest text-ink bg-cream shadow-md"
      >
        <div className="flex items-center justify-between w-full px-4 md:px-10 lg:px-36">
          <nav className="hidden md:flex gap-12">
            <Link href="/about">TENTANG</Link>
            <Link href="/product">PRODUK</Link>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={275}
                height={200}
                priority
                className="h-12 md:h-16 lg:h-20"
                style={{ width: "auto" }}
              />
            </Link>
          </div>

          <nav className="hidden md:flex gap-12">
            <Link href="/contact">KONTAK</Link>
            <Link href="/gallery">GALERI</Link>
            <Link href="/cart" className="relative text-xl" aria-label="Keranjang Saya">
              <BiShoppingBag />
              {totalCount > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-medium text-white">
                  {totalCount}
                </span>
              )}
            </Link>
            <Link href="/login" className="text-xl" aria-label="Masuk">
              <BiLogIn />
            </Link>
          </nav>
        </div>
      </header>

      <div className="fixed top-6 right-4 z-50 md:hidden">
        <HamburgerButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>

      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
