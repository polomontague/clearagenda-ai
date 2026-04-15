/*
  Warnings:

  - You are about to drop the `task_steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task_steps` DROP FOREIGN KEY `task_steps_task_id_fkey`;

-- DropTable
DROP TABLE `task_steps`;

-- DropTable
DROP TABLE `tasks`;
