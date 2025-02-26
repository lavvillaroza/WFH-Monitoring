/*
  Warnings:

  - You are about to alter the column `status` on the `dailytimerecordproblem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `leave` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `status` on the `overtime` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `employeeId` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DailyTimeRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveType` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dailytimerecordproblem` DROP FOREIGN KEY `DailyTimeRecordProblem_userId_fkey`;

-- DropForeignKey
ALTER TABLE `leave` DROP FOREIGN KEY `Leave_employeeId_fkey`;

-- DropIndex
DROP INDEX `DailyTimeRecordProblem_userId_fkey` ON `dailytimerecordproblem`;

-- DropIndex
DROP INDEX `Leave_employeeId_fkey` ON `leave`;

-- AlterTable
ALTER TABLE `dailytimerecord` ADD COLUMN `employeeId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `dailytimerecordproblem` MODIFY `status` ENUM('PENDING', 'RESOLVED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `leave` ADD COLUMN `leaveType` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `overtime` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE';

-- AddForeignKey
ALTER TABLE `DailyTimeRecord` ADD CONSTRAINT `DailyTimeRecord_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTimeRecordProblem` ADD CONSTRAINT `DailyTimeRecordProblem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
