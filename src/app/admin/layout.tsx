import type { Metadata } from "next";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin - Sempe Dollar Murni",
  description: "Panel admin Sempe Dollar Murni.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-cream-soft">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
