import type { Metadata } from "next";
import AdminShell from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin - Sempe Dollar Murni",
  description: "Panel admin Sempe Dollar Murni.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
