/*
  Warnings:

  - You are about to drop the column `spotifyAuthors` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyPlaylistName` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyTrackName` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyType` on the `tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tag` DROP COLUMN `spotifyAuthors`,
    DROP COLUMN `spotifyPlaylistName`,
    DROP COLUMN `spotifyTrackName`,
    DROP COLUMN `spotifyType`;
