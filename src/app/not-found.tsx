import type { Metadata } from "next";
import ErrorState from "@/components/ErrorState";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="Halaman tidak ditemukan"
      message="Sepertinya halaman yang kamu cari sudah dipindah atau tidak pernah ada. Yuk, kembali ke beranda dan jelajahi Sempe kami."
    />
  );
}
