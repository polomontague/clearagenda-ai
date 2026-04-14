/*
  Warnings:

  - Added the required column `item_id` to the `item_steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item_steps` ADD COLUMN `item_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `item_steps` ADD CONSTRAINT `item_steps_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
