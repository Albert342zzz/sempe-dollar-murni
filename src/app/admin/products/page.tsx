import { prisma } from "@/lib/prisma";
import PriceManager from "@/components/Admin/PriceManager";
import FlavorManager from "@/components/Admin/FlavorManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [flavorRows, sizeRows] = await Promise.all([
    prisma.flavor.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.size.findMany({ orderBy: { price: "asc" } }),
  ]);

  const flavors = flavorRows.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    accent: f.accent,
    image: f.image,
  }));
  const sizes = sizeRows.map((s) => ({
    id: s.id,
    label: s.label,
    price: s.price,
  }));

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Produk</h1>
        <p className="text-sm text-ink/60">
          Kelola rasa Sempe dan harga ukuran.
        </p>
      </div>

      <PriceManager sizes={sizes} />
      <FlavorManager flavors={flavors} />
    </div>
  );
}
