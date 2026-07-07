import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SessionGuard from "@/components/SessionGuard";

const defaultFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sempe Dollar Murni",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${defaultFont.className} h-full antialiased`}>
      <body className="min-h-full">
        <SessionGuard />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
