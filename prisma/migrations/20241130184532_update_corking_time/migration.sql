/*
  Warnings:

  - You are about to drop the `worktime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `FreeDaysRequest_userId_fkey` ON `freedaysrequest`;

-- DropIndex
DROP INDEX `HelpdeskRequest_userId_fkey` ON `helpdeskrequest`;

-- DropIndex
DROP INDEX `User_managerId_fkey` ON `user`;

-- DropTable
DROP TABLE `worktime`;

-- CreateTable
CREATE TABLE `WorkTimeEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `eventTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `day` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HelpdeskRequest` ADD CONSTRAINT `HelpdeskRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeDaysRequest` ADD CONSTRAINT `FreeDaysRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
