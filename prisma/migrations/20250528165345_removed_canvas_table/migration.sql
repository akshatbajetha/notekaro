/*
  Warnings:

  - You are about to drop the column `canvasId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the `Canvas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Canvas" DROP CONSTRAINT "Canvas_userId_fkey";

-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_canvasId_fkey";

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "canvasId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Canvas";

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
