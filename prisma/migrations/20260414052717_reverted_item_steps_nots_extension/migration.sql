/*
  Warnings:

  - You are about to alter the column `notes` on the `item_steps` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE `item_steps` MODIFY `notes` VARCHAR(300) NOT NULL;
