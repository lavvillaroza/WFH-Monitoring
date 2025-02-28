/*
  Warnings:

  - You are about to drop the column `timeout` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `dailytimerecord` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailytimerecord` DROP COLUMN `timeout`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `timeOut` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `remarks` VARCHAR(191) NULL;
