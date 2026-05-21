/*
  Warnings:

  - You are about to alter the column `once_at` on the `reminders` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `deadline` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `repeating_deadline` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reminders` MODIFY `once_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `deadline`,
    ADD COLUMN `once_deadline` DATE NULL,
    ADD COLUMN `repeating_deadline` INTEGER NOT NULL;
