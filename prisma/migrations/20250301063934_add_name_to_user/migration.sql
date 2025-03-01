/*
  Warnings:

  - You are about to drop the column `userId` on the `employeedetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `employeedetails` DROP FOREIGN KEY `EmployeeDetails_userId_fkey`;

-- DropIndex
DROP INDEX `EmployeeDetails_userId_key` ON `employeedetails`;

-- AlterTable
ALTER TABLE `employeedetails` DROP COLUMN `userId`;
