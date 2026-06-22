import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { flavors, sizes, priceBySize } from "../src/lib/flavors";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Mengisi database dengan data rasa & ukuran dari lib/flavors.ts.
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

  for (const label of sizes) {
    await prisma.size.upsert({
      where: { label },
      update: { price: priceBySize[label] ?? 0 },
      create: { label, price: priceBySize[label] ?? 0 },
    });
  }

  console.log(`Seed selesai: ${flavors.length} rasa, ${sizes.length} ukuran.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
