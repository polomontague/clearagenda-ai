/*
  Warnings:

  - You are about to alter the column `once_at` on the `reminders` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `reminders` MODIFY `once_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `task_step_completions` MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tasks` MODIFY `once_deadline` VARCHAR(191) NULL;
