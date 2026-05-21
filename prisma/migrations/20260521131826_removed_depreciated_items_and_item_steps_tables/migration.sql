/*
  Warnings:

  - You are about to drop the `item_steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `item_steps` DROP FOREIGN KEY `item_steps_item_id_fkey`;

-- DropTable
DROP TABLE `item_steps`;

-- DropTable
DROP TABLE `items`;
