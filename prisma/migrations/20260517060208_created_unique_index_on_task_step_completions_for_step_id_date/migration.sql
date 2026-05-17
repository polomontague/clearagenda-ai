/*
  Warnings:

  - A unique constraint covering the columns `[step_id,date]` on the table `task_step_completions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `task_step_completions_step_id_date_key` ON `task_step_completions`(`step_id`, `date`);
