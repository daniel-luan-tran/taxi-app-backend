/*
  Warnings:

  - You are about to drop the column `from` on the `BookingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `BookingHistory` table. All the data in the column will be lost.
  - Added the required column `end_lat` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_lng` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_lat` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_lng` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BOOKINGSTATUS" AS ENUM ('SUCCESS', 'CANCELED');

-- AlterTable
ALTER TABLE "BookingHistory" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "end_lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "end_lng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "start_lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "start_lng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "BOOKINGSTATUS" NOT NULL DEFAULT 'SUCCESS';
