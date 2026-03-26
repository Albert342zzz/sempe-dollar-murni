import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";

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
      <body className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
