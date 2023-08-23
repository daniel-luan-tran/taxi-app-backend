/*
  Warnings:

  - You are about to drop the column `azureOid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "azureOid",
DROP COLUMN "displayName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "azure_oid" TEXT,
ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "phone_number" TEXT,
ALTER COLUMN "role" DROP DEFAULT;
