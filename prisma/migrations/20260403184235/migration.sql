/*
  Warnings:

  - You are about to alter the column `name` on the `task_steps` table. The data in that column could be lost. The data in that column will be cast from `VarChar(300)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `task_steps` MODIFY `name` VARCHAR(100) NOT NULL,
    ALTER COLUMN `notes` DROP DEFAULT;
