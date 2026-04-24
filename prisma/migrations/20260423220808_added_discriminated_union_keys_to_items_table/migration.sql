-- AlterTable
ALTER TABLE `items` ADD COLUMN `occcurs` ENUM('once', 'repeating') NOT NULL DEFAULT 'once',
    ADD COLUMN `type` ENUM('task', 'event') NOT NULL DEFAULT 'task';
