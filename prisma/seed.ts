import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { flavors, sizes, priceBySize } from "../src/lib/flavors";
import { galleryItems } from "../src/lib/gallery";
import { processGalleryImage } from "../src/lib/gallery-upload";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Fill the GalleryImage table from files in /public if it is still empty.
async function seedGallery() {
  const count = await prisma.galleryImage.count();
  if (count > 0) {
    console.log(`Gallery already seeded (${count} images), skipped.`);
    return;
  }

  let order = 0;
  for (const item of galleryItems) {
    const ext = path.extname(item.src).toLowerCase();
    if (!MIME[ext]) continue;
    try {
      const filePath = path.join(process.cwd(), "public", item.src);
      const raw = new Uint8Array(await readFile(filePath));
      const data = await processGalleryImage(raw); // resize + WebP
      await prisma.galleryImage.create({
        data: { data, mimeType: "image/webp", alt: item.alt, sortOrder: order++ },
      });
    } catch (e) {
      console.warn(`Skip gallery image ${item.src}:`, (e as Error).message);
    }
  }
  console.log(`Seeded ${order} gallery images.`);
}

// Seeds the database with flavors, sizes, and initial per-flavor prices from lib/flavors.ts.
async function main() {
  for (const f of flavors) {
    await prisma.flavor.upsert({
      where: { id: f.id },
      update: {
        name: f.name,
        description: f.description,
        accent: f.accent,
        image: f.image,
      },
      create: {
        id: f.id,
        name: f.name,
        description: f.description,
        accent: f.accent,
        image: f.image,
      },
    });
  }

  // Remove sizes no longer in the list (cascades to FlavorPrice).
  await prisma.size.deleteMany({ where: { label: { notIn: sizes } } });

  for (const label of sizes) {
    await prisma.size.upsert({
      where: { label },
      update: { price: priceBySize[label] ?? 0 },
      create: { label, price: priceBySize[label] ?? 0 },
    });
  }

  // Per-flavor prices, seeded from the default size price.
  // Admins can adjust each flavor's price from the Products page.
  const sizeRows = await prisma.size.findMany();
  for (const f of flavors) {
    for (const s of sizeRows) {
      await prisma.flavorPrice.upsert({
        where: { flavorId_sizeId: { flavorId: f.id, sizeId: s.id } },
        update: {},
        create: { flavorId: f.id, sizeId: s.id, price: s.price },
      });
    }
  }

  await seedGallery();
  await seedOutlets();

  console.log(`Seed done: ${flavors.length} flavors, ${sizes.length} sizes.`);
}

// Fill the Outlet table with sample (placeholder) data if it is still empty.
async function seedOutlets() {
  const count = await prisma.outlet.count();
  if (count > 0) {
    console.log(`Outlets already seeded (${count}), skipped.`);
    return;
  }
  await prisma.outlet.createMany({
    data: [
      { name: "Toko Oleh-oleh Pak Budi", address: "Jl. Jend. Sudirman No.12, Temanggung, Jawa Tengah" },
      { name: "Sentra UMKM Kudus", address: "Jl. Sunan Kudus No.45, Kudus, Jawa Tengah" },
      { name: "Pusat Oleh-oleh Semarang", address: "Jl. Pandanaran No.88, Semarang, Jawa Tengah" },
    ],
  });
  console.log("Seeded 3 outlets.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
