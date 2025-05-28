/*
  Warnings:

  - You are about to drop the column `color` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `sketchId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the `Sketch` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `canvasId` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strokeWidth` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x1` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y1` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Element` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `stroke` on table `Element` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ElementType" AS ENUM ('PENCIL', 'TEXT', 'LINE', 'RECT', 'CIRCLE', 'DIAMOND', 'ARROW');

-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_sketchId_fkey";

-- DropForeignKey
ALTER TABLE "Sketch" DROP CONSTRAINT "Sketch_userId_fkey";

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "color",
DROP COLUMN "height",
DROP COLUMN "sketchId",
DROP COLUMN "width",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "canvasId" TEXT NOT NULL,
ADD COLUMN     "strokeWidth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "x1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "x2" DOUBLE PRECISION,
ADD COLUMN     "y1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y2" DOUBLE PRECISION,
DROP COLUMN "type",
ADD COLUMN     "type" "ElementType" NOT NULL,
ALTER COLUMN "stroke" SET NOT NULL;

-- DropTable
DROP TABLE "Sketch";

-- CreateTable
CREATE TABLE "Canvas" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scale" INTEGER NOT NULL DEFAULT 1,
    "panOffsetX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "panOffsetY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Canvas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Canvas_userId_key" ON "Canvas"("userId");

-- AddForeignKey
ALTER TABLE "Canvas" ADD CONSTRAINT "Canvas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
