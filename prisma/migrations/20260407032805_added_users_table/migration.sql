-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(60) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(11) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `sunday_hours` INTEGER NOT NULL,
    `monday_hours` INTEGER NOT NULL,
    `tuesday_hours` INTEGER NOT NULL,
    `wednesday_hours` INTEGER NOT NULL,
    `thursday_hours` INTEGER NOT NULL,
    `friday_hours` INTEGER NOT NULL,
    `saturday_hours` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
