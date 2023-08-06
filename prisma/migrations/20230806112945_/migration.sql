/*
  Warnings:

  - The primary key for the `templateentry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `templateentry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `templateId` on the `templateentry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `playlisttemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `templateentry` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `templateId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `playlisttemplate`;

-- CreateTable
CREATE TABLE `Template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `public` BOOLEAN NOT NULL,
    `type` ENUM('CUSTOM', 'EXPLORE') NOT NULL,

    INDEX `Template_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
