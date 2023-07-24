/*
  Warnings:

  - Added the required column `type` to the `PlaylistTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `playlisttemplate` ADD COLUMN `type` ENUM('CUSTOM', 'EXPLORE') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `type` ENUM('ADMIN', 'USER') NOT NULL;
