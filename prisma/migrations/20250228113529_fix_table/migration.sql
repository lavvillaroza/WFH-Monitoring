/*
  Warnings:

  - You are about to drop the column `action` on the `dailytimerecord` table. All the data in the column will be lost.
  - Added the required column `remarks` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeIn` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeout` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailytimerecord` DROP COLUMN `action`,
    ADD COLUMN `remarks` VARCHAR(191) NOT NULL,
    ADD COLUMN `timeIn` DATETIME(3) NOT NULL,
    ADD COLUMN `timeout` DATETIME(3) NOT NULL;
