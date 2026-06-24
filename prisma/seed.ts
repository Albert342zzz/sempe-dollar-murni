import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { flavors, sizes, priceBySize } from "../src/lib/flavors";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

  console.log(`Seed done: ${flavors.length} flavors, ${sizes.length} sizes.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
