/*
  Warnings:

  - You are about to drop the column `end` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `end`,
    DROP COLUMN `start`;
