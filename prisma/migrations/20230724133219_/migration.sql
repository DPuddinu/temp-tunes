/*
  Warnings:

  - You are about to drop the column `stars` on the `playlisttemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `playlisttemplate` DROP COLUMN `stars`,
    ADD COLUMN `color` VARCHAR(191) NULL;
