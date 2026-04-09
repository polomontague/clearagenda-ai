-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `user_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
