/*
  Warnings:

  - You are about to drop the column `projectName` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `teamImages` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `userImage` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `Team` table. All the data in the column will be lost.
  - Added the required column `major` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamDivision` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "projectName",
DROP COLUMN "teamImages",
DROP COLUMN "userImage",
DROP COLUMN "userName",
DROP COLUMN "userRole",
ADD COLUMN     "major" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "profileImage" TEXT NOT NULL,
ADD COLUMN     "teamDivision" TEXT NOT NULL;
