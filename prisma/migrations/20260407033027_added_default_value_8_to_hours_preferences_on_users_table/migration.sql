-- AlterTable
ALTER TABLE `users` MODIFY `sunday_hours` INTEGER NOT NULL DEFAULT 8,
    MODIFY `monday_hours` INTEGER NOT NULL DEFAULT 8,
    MODIFY `tuesday_hours` INTEGER NOT NULL DEFAULT 8,
    MODIFY `wednesday_hours` INTEGER NOT NULL DEFAULT 8,
    MODIFY `thursday_hours` INTEGER NOT NULL DEFAULT 8,
    MODIFY `friday_hours` INTEGER NOT NULL DEFAULT 8,
    MODIFY `saturday_hours` INTEGER NOT NULL DEFAULT 8;
