-- AlterTable
ALTER TABLE `users` ADD COLUMN `accent` ENUM('red', 'orange', 'coral', 'yellow', 'lime', 'green', 'mint', 'turquoise', 'sky', 'lavender', 'pink') NOT NULL DEFAULT 'red';
