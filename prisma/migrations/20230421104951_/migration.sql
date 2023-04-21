/*
  Warnings:

  - You are about to drop the column `spotifyId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_spotifyId_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `spotifyId`;
