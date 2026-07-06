import { prisma } from "@/lib/prisma";
import { galleryImageUrl } from "@/lib/gallery";
import GalleryManager from "@/components/Admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  const items = images.map((img) => ({
    id: img.id,
    url: galleryImageUrl(img.id, img.updatedAt),
    alt: img.alt,
  }));

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Galeri</h1>
        <p className="text-sm text-ink/60">
          Kelola foto yang tampil di halaman Galeri — tambah, ganti, urutkan,
          atau hapus.
        </p>
      </div>

      <GalleryManager images={items} />
    </div>
  );
}
