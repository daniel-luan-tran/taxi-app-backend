/*
  Warnings:

  - Added the required column `price_usd` to the `driver_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "driver_types" ADD COLUMN     "price_usd" DOUBLE PRECISION NOT NULL;
