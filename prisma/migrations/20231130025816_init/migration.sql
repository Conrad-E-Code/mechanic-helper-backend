-- CreateTable
CREATE TABLE "VehicleModelYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT,
    "model" VARCHAR(50) NOT NULL,

    CONSTRAINT "VehicleModelYear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "I_VehicleModelYear_year" ON "VehicleModelYear"("year");

-- CreateIndex
CREATE INDEX "I_VehicleModelYear_make" ON "VehicleModelYear"("make");

-- CreateIndex
CREATE INDEX "I_VehicleModelYear_model" ON "VehicleModelYear"("model");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModelYear_year_make_model_key" ON "VehicleModelYear"("year", "make", "model");
