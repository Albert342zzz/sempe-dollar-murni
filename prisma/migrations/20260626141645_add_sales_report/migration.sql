-- CreateTable
CREATE TABLE "SalesReport" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "totalAmount" INTEGER NOT NULL,
    "totalQty" INTEGER NOT NULL,
    "validRows" INTEGER NOT NULL,
    "skippedRows" INTEGER NOT NULL,
    "aiSummary" TEXT,

    CONSTRAINT "SalesReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesRecord" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "SalesRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalesRecord_reportId_idx" ON "SalesRecord"("reportId");

-- CreateIndex
CREATE INDEX "SalesRecord_code_idx" ON "SalesRecord"("code");

-- AddForeignKey
ALTER TABLE "SalesRecord" ADD CONSTRAINT "SalesRecord_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SalesReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
