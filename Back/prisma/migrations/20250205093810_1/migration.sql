-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phonenumber` VARCHAR(191) NOT NULL,
    `admin` VARCHAR(191) NOT NULL DEFAULT 'false',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `talalt_elveszett` VARCHAR(191) NOT NULL,
    `allatfaj` VARCHAR(191) NOT NULL,
    `kategoria` VARCHAR(191) NOT NULL,
    `datum` VARCHAR(191) NOT NULL,
    `nev` VARCHAR(191) NOT NULL,
    `neme` VARCHAR(191) NOT NULL,
    `szin` VARCHAR(191) NOT NULL,
    `meret` VARCHAR(191) NOT NULL,
    `egyeb_info` VARCHAR(191) NOT NULL,
    `helyszin` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `visszakerult_e` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
