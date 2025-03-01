/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `EmployeeDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `EmployeeDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employeedetails` ADD COLUMN `employeeId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EmployeeDetails_employeeId_key` ON `EmployeeDetails`(`employeeId`);
