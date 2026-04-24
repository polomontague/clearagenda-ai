-- AlterTable
ALTER TABLE `items` ADD COLUMN `occurs` ENUM('once', 'repeating') NOT NULL DEFAULT 'once';
