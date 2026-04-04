-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `name` VARCHAR(100) NULL,
    ADD COLUMN `notes` VARCHAR(300) NULL,
    MODIFY `description` TEXT NULL;
