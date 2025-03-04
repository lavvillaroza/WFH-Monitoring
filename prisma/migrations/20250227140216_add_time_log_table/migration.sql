/*
  Warnings:

  - The primary key for the `dailytimerecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `breakIn` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `breakOut` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `checkIn` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `dailytimerecord` table. All the data in the column will be lost.
  - Added the required column `action` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailytimerecord` DROP PRIMARY KEY,
    DROP COLUMN `breakIn`,
    DROP COLUMN `breakOut`,
    DROP COLUMN `checkIn`,
    DROP COLUMN `checkOut`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `day`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
