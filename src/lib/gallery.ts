export type GalleryItem = {
  src: string;
  alt: string;
};

// URL for a DB-backed gallery image. `v` (updatedAt) forces a refresh when the photo changes.
export function galleryImageUrl(id: number, updatedAt: Date | string): string {
  const v =
    typeof updatedAt === "string"
      ? new Date(updatedAt).getTime()
      : updatedAt.getTime();
  return `/api/gallery/${id}?v=${v}`;
}

// Fallback photos shown when the gallery table is empty; also used to seed it.
export const galleryItems: GalleryItem[] = [
  { src: "/images/slider/1.jpg", alt: "Suasana produksi kue kering" },
  { src: "/images/product3.png", alt: "Aneka kue kering Sempe Dollar Murni" },
  { src: "/images/slider/2.jpg", alt: "Koleksi produk Sempe Dollar Murni" },
  { src: "/images/owner2.jpg", alt: "Proses pembuatan kue kering" },
  { src: "/images/slider/3.jpg", alt: "Kemasan produk" },
  { src: "/images/heroProduct.webp", alt: "Varian rasa kue kering" },
  { src: "/images/slider/4.jpg", alt: "Produk unggulan" },
  { src: "/images/owner.jpg", alt: "Pendiri Sempe Dollar Murni" },
  { src: "/images/slider/5.jpg", alt: "Kue kering pilihan" },
];
