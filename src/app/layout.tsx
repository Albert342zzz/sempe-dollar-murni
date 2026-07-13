import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SessionGuard from "@/components/SessionGuard";
import { SITE_URL } from "@/lib/site";

const defaultFont = Inter({ subsets: ["latin"] });

const description =
  "Sempe Dollar Murni — kue Sempe renyah khas Temanggung sejak 1986. Beragam pilihan rasa, bersertifikasi halal MUI. Pesan langsung via WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sempe Dollar Murni — Sempe Renyah Khas Temanggung",
    template: "%s · Sempe Dollar Murni",
  },
  description,
  keywords: [
    "Sempe Dollar Murni",
    "sempe",
    "keripik sempe",
    "oleh-oleh Temanggung",
    "camilan halal",
    "UMKM Temanggung",
  ],
  authors: [{ name: "Sempe Dollar Murni" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Sempe Dollar Murni",
    title: "Sempe Dollar Murni — Sempe Renyah Khas Temanggung",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sempe Dollar Murni — Sempe Renyah Khas Temanggung",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${defaultFont.className} h-full antialiased`}>
      <body className="min-h-full">
        <SessionGuard />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
