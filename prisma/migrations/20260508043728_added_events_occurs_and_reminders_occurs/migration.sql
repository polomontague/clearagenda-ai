/*
  Warnings:

  - You are about to alter the column `once_at` on the `reminders` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `occurs` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occurs` to the `reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` ADD COLUMN `occurs` ENUM('once', 'repeating') NOT NULL;

-- AlterTable
ALTER TABLE `reminders` ADD COLUMN `occurs` ENUM('once', 'repeating') NOT NULL,
    MODIFY `once_at` DATETIME NULL;
