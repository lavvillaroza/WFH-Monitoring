/*
  Warnings:

  - You are about to drop the column `employeeId` on the `employeedetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `EmployeeDetails_employeeId_key` ON `employeedetails`;

-- AlterTable
ALTER TABLE `employeedetails` DROP COLUMN `employeeId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `employeeId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_employeeId_key` ON `User`(`employeeId`);
