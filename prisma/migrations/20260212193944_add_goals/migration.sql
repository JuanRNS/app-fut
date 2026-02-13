/*
  Warnings:

  - Added the required column `goals` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "goals" INTEGER NOT NULL;
