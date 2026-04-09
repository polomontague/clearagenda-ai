-- AlterTable
ALTER TABLE `task_steps` ADD COLUMN `completed` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `completed` DATETIME(3) NULL;
