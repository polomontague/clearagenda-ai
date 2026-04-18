/*
  Warnings:

  - You are about to drop the column `input` on the `generations` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `generations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `generations` DROP COLUMN `input`,
    DROP COLUMN `output`;
