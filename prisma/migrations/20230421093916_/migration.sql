/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spotifyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotifyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `emailVerified`,
    ADD COLUMN `spotifyId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_spotifyId_key` ON `User`(`spotifyId`);
