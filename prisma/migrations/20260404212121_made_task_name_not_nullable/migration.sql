/*
  Warnings:

  - Made the column `name` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `name` VARCHAR(100) NOT NULL;
