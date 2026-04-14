/*
  Warnings:

  - The values [device] on the enum `users_theme` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `theme` ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'light';
