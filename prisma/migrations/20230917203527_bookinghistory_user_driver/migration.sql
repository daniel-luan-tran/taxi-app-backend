/*
  Warnings:

  - Changed the type of `driverId` on the `BookingHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BookingHistory" DROP CONSTRAINT "BookingHistory_userId_fkey";

-- AlterTable
ALTER TABLE "BookingHistory" DROP COLUMN "driverId",
ADD COLUMN     "driverId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "BookingHistory" ADD CONSTRAINT "BookingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHistory" ADD CONSTRAINT "BookingHistory_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;
