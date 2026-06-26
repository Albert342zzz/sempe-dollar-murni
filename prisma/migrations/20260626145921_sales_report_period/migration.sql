/*
  Warnings:

  - You are about to drop the column `code` on the `SalesRecord` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `SalesRecord` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `SalesRecord` table. All the data in the column will be lost.
  - You are about to drop the column `periodEnd` on the `SalesReport` table. All the data in the column will be lost.
  - You are about to drop the column `periodStart` on the `SalesReport` table. All the data in the column will be lost.
  - Added the required column `flavor` to the `SalesRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `SalesRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodMonth` to the `SalesReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodYear` to the `SalesReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SalesRecord_code_idx";

-- AlterTable
ALTER TABLE "SalesRecord" DROP COLUMN "code",
DROP COLUMN "date",
DROP COLUMN "label",
ADD COLUMN     "flavor" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalesReport" DROP COLUMN "periodEnd",
DROP COLUMN "periodStart",
ADD COLUMN     "periodMonth" INTEGER NOT NULL,
ADD COLUMN     "periodYear" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "SalesReport_periodYear_periodMonth_idx" ON "SalesReport"("periodYear", "periodMonth");
