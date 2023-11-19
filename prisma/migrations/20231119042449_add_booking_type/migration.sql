/*
  Warnings:

  - Added the required column `booking_type` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BOOKINGTYPE" AS ENUM ('PHONE_CALL', 'MOBILE_APP');

-- AlterTable
ALTER TABLE "BookingHistory" ADD COLUMN     "booking_type" "BOOKINGTYPE" NOT NULL;
