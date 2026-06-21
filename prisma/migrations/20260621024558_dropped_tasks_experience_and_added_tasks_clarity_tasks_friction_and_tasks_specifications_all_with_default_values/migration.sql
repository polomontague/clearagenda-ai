/*
  Warnings:

  - You are about to drop the column `experience` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `experience`,
    ADD COLUMN `clarity` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    ADD COLUMN `friction` JSON NOT NULL,
    ADD COLUMN `specifications` JSON NOT NULL;
