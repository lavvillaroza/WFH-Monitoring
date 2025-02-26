/*
  Warnings:

  - You are about to drop the column `issue` on the `dailytimerecordproblem` table. All the data in the column will be lost.
  - Added the required column `remarks` to the `DailyTimeRecordProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `DailyTimeRecordProblem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailytimerecordproblem` DROP COLUMN `issue`,
    ADD COLUMN `remarks` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
