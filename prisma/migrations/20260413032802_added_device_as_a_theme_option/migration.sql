-- AlterTable
ALTER TABLE `users` MODIFY `theme` ENUM('light', 'dark', 'device') NOT NULL DEFAULT 'light';
