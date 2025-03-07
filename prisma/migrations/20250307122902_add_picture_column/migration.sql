-- AlterTable
ALTER TABLE `User` ADD COLUMN `picture` LONGBLOB NULL;

-- CreateTable
CREATE TABLE `ScreenShots` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `picture` LONGBLOB NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ScreenShots_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
