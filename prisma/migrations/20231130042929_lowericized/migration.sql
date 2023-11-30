/*
  Warnings:

  - You are about to drop the `VehicleModelYear` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "VehicleModelYear";

-- CreateTable
CREATE TABLE "vehiclemodelyear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT,
    "model" VARCHAR(50) NOT NULL,

    CONSTRAINT "vehiclemodelyear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "I_vehiclemodelyear_year" ON "vehiclemodelyear"("year");

-- CreateIndex
CREATE INDEX "I_vehiclemodelyear_make" ON "vehiclemodelyear"("make");

-- CreateIndex
CREATE INDEX "I_vehiclemodelyear_model" ON "vehiclemodelyear"("model");

-- CreateIndex
CREATE UNIQUE INDEX "vehiclemodelyear_year_make_model_key" ON "vehiclemodelyear"("year", "make", "model");
