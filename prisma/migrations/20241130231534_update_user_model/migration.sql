-- DropIndex
DROP INDEX `FreeDaysRequest_userId_fkey` ON `freedaysrequest`;

-- DropIndex
DROP INDEX `HelpdeskRequest_userId_fkey` ON `helpdeskrequest`;

-- DropIndex
DROP INDEX `User_managerId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `freeDays` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HelpdeskRequest` ADD CONSTRAINT `HelpdeskRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeDaysRequest` ADD CONSTRAINT `FreeDaysRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
