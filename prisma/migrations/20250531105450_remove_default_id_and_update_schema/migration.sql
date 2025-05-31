/*
  Warnings:

  - You are about to drop the column `fill` on the `Element` table. All the data in the column will be lost.
  - You are about to alter the column `strokeWidth` on the `Element` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "fill",
ALTER COLUMN "strokeWidth" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "Element_userId_idx" ON "Element"("userId");
