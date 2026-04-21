-- AlterTable
ALTER TABLE `items` ADD COLUMN `end` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(300) NULL,
    ADD COLUMN `start` DATETIME(3) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `importance` DOUBLE NULL;
