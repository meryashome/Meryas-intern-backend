/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `freeDays` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `FreeDaysRequest_userId_fkey` ON `freedaysrequest`;

-- DropIndex
DROP INDEX `HelpdeskRequest_userId_fkey` ON `helpdeskrequest`;

-- DropIndex
DROP INDEX `User_managerId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updatedAt`,
    ADD COLUMN `cityOrTown` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `extraDays` INTEGER NULL,
    ADD COLUMN `freeDays` INTEGER NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HelpdeskRequest` ADD CONSTRAINT `HelpdeskRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeDaysRequest` ADD CONSTRAINT `FreeDaysRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
