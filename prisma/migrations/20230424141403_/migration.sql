/*
  Warnings:

  - Added the required column `spotifyTrackName` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tag` ADD COLUMN `spotifyAuthors` VARCHAR(191) NULL,
    ADD COLUMN `spotifyPlaylistName` VARCHAR(191) NULL,
    ADD COLUMN `spotifyTrackName` VARCHAR(191) NOT NULL;
