import { prisma } from "@/lib/prisma";
import OutletManager from "@/components/Admin/OutletManager";

export const dynamic = "force-dynamic";

export default async function OutletsPage() {
  const outlets = await prisma.outlet.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Cabang &amp; Toko</h1>
        <p className="text-sm text-ink/60">
          Kelola daftar toko pada section &quot;Temukan Produk Kami di&quot; di
          halaman Kontak. Jika kosong, section-nya otomatis disembunyikan.
        </p>
      </div>

      <OutletManager
        outlets={outlets.map((o) => ({
          id: o.id,
          name: o.name,
          address: o.address,
        }))}
      />
    </div>
  );
}
