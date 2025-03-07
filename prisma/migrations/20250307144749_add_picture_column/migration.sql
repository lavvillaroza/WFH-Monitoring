/*
  Warnings:

  - You are about to drop the `ScreenShots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ScreenShots`;

-- CreateTable
CREATE TABLE `ScreenShotModel` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `picture` LONGBLOB NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ScreenShotModel_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
