/*
  Warnings:

  - Made the column `name` on table `playlisttemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `playlisttemplate` ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
