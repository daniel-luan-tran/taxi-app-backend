/*
  Warnings:

  - The values [CANCELED] on the enum `BOOKINGSTATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BOOKINGSTATUS_new" AS ENUM ('SUCCESS', 'DRIVER_CANCEL', 'USER_CANCEL');
ALTER TABLE "BookingHistory" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BookingHistory" ALTER COLUMN "status" TYPE "BOOKINGSTATUS_new" USING ("status"::text::"BOOKINGSTATUS_new");
ALTER TYPE "BOOKINGSTATUS" RENAME TO "BOOKINGSTATUS_old";
ALTER TYPE "BOOKINGSTATUS_new" RENAME TO "BOOKINGSTATUS";
DROP TYPE "BOOKINGSTATUS_old";
ALTER TABLE "BookingHistory" ALTER COLUMN "status" SET DEFAULT 'SUCCESS';
COMMIT;
