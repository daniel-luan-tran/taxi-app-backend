-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_driverTypeId_fkey";

-- AlterTable
ALTER TABLE "drivers" ALTER COLUMN "driverTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_driverTypeId_fkey" FOREIGN KEY ("driverTypeId") REFERENCES "driver_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
