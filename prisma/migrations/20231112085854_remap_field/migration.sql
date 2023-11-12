/*
  Warnings:

  - You are about to drop the column `driverId` on the `BookingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BookingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `driverTypeId` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `passwords` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `passwords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `staffs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `driver_id` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `passwords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `staffs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingHistory" DROP CONSTRAINT "BookingHistory_driverId_fkey";

-- DropForeignKey
ALTER TABLE "BookingHistory" DROP CONSTRAINT "BookingHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_accountId_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_driverTypeId_fkey";

-- DropForeignKey
ALTER TABLE "passwords" DROP CONSTRAINT "passwords_user_id_fkey";

-- DropForeignKey
ALTER TABLE "staffs" DROP CONSTRAINT "staffs_accountId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_accountId_fkey";

-- DropIndex
DROP INDEX "drivers_accountId_key";

-- DropIndex
DROP INDEX "passwords_user_id_key";

-- DropIndex
DROP INDEX "staffs_accountId_key";

-- DropIndex
DROP INDEX "users_accountId_key";

-- AlterTable
ALTER TABLE "BookingHistory" DROP COLUMN "driverId",
DROP COLUMN "userId",
ADD COLUMN     "driver_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "accountId",
DROP COLUMN "driverTypeId",
ADD COLUMN     "account_id" UUID NOT NULL,
ADD COLUMN     "driver_type_id" INTEGER;

-- AlterTable
ALTER TABLE "passwords" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "accountId",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountId",
ADD COLUMN     "account_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "drivers_account_id_key" ON "drivers"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "passwords_account_id_key" ON "passwords"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_account_id_key" ON "staffs"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_account_id_key" ON "users"("account_id");

-- AddForeignKey
ALTER TABLE "passwords" ADD CONSTRAINT "passwords_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_driver_type_id_fkey" FOREIGN KEY ("driver_type_id") REFERENCES "driver_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHistory" ADD CONSTRAINT "BookingHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHistory" ADD CONSTRAINT "BookingHistory_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
