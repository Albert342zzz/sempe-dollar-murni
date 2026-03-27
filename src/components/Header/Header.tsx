"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BiShoppingBag, BiLogIn } from "react-icons/bi";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed w-full z-30 h-20 flex items-center transition-all duration-300 text-sm tracking-widest text-black
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
      >
        <div className="flex items-center justify-between w-full px-4 md:px-10 lg:px-36">
          <nav className="hidden md:flex gap-12">
            <Link href="/about">TENTANG</Link>
            <Link href="/product">PRODUK</Link>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <img
                className="h-12 md:h-16 lg:h-20"
                src="/images/logo/logo.png"
                alt="Logo"
              />
            </Link>
          </div>

          <nav className="hidden md:flex gap-12">
            <Link href="/contact">KONTAK</Link>
            <Link href="/gallery">GALERI</Link>
            <Link href="/" className="text-xl">
              <BiShoppingBag />
            </Link>
            <Link href="/" className="text-xl">
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
