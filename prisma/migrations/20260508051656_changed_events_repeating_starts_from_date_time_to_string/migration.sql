/*
  Warnings:

  - You are about to alter the column `once_at` on the `reminders` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `events` MODIFY `repeating_starts` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reminders` MODIFY `once_at` DATETIME NULL;
