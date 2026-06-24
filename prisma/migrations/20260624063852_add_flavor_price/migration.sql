-- CreateTable
CREATE TABLE "FlavorPrice" (
    "id" SERIAL NOT NULL,
    "flavorId" TEXT NOT NULL,
    "sizeId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "FlavorPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlavorPrice_flavorId_sizeId_key" ON "FlavorPrice"("flavorId", "sizeId");

-- AddForeignKey
ALTER TABLE "FlavorPrice" ADD CONSTRAINT "FlavorPrice_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "Flavor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlavorPrice" ADD CONSTRAINT "FlavorPrice_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
