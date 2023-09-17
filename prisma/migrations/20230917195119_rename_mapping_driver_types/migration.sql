/*
  Warnings:

  - You are about to drop the `DriverType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_driverTypeId_fkey";

-- DropTable
DROP TABLE "DriverType";

-- CreateTable
CREATE TABLE "driver_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "driver_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_driverTypeId_fkey" FOREIGN KEY ("driverTypeId") REFERENCES "driver_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
