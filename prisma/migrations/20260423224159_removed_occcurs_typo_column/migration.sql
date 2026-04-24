/*
  Warnings:

  - You are about to drop the column `occcurs` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `occcurs`,
    ALTER COLUMN `occurs` DROP DEFAULT;
