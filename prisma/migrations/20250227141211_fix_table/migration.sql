/*
  Warnings:

  - You are about to drop the column `employeeId` on the `dailytimerecord` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `leave` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `overtime` table. All the data in the column will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Overtime` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dailytimerecord` DROP FOREIGN KEY `DailyTimeRecord_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- DropForeignKey
ALTER TABLE `leave` DROP FOREIGN KEY `Leave_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `overtime` DROP FOREIGN KEY `Overtime_employeeId_fkey`;

-- DropIndex
DROP INDEX `DailyTimeRecord_employeeId_fkey` ON `dailytimerecord`;

-- DropIndex
DROP INDEX `Leave_employeeId_fkey` ON `leave`;

-- DropIndex
DROP INDEX `Overtime_employeeId_fkey` ON `overtime`;

-- AlterTable
ALTER TABLE `dailytimerecord` DROP COLUMN `employeeId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `leave` DROP COLUMN `employeeId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `overtime` DROP COLUMN `employeeId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `employee`;

-- AddForeignKey
ALTER TABLE `DailyTimeRecord` ADD CONSTRAINT `DailyTimeRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Overtime` ADD CONSTRAINT `Overtime_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
