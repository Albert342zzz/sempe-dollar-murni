import { prisma } from "@/lib/prisma";
import PriceMatrix from "@/components/Admin/PriceMatrix";
import FlavorManager from "@/components/Admin/FlavorManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [flavorRows, sizeRows, flavorPriceRows] = await Promise.all([
    prisma.flavor.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.size.findMany({ orderBy: { price: "asc" } }),
    prisma.flavorPrice.findMany(),
  ]);

  const flavors = flavorRows.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    accent: f.accent,
    image: f.image,
  }));
  const sizes = sizeRows.map((s) => ({ id: s.id, label: s.label }));

  // Bangun matriks harga: flavorId -> sizeId -> harga.
  const matrix: Record<string, Record<number, number>> = {};
  for (const fp of flavorPriceRows) {
    (matrix[fp.flavorId] ??= {})[fp.sizeId] = fp.price;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Produk</h1>
        <p className="text-sm text-ink/60">
          Kelola rasa Sempe dan harga per rasa.
        </p>
      </div>

      <PriceMatrix flavors={flavors} sizes={sizes} matrix={matrix} />
      <FlavorManager flavors={flavors} />
    </div>
  );
}
