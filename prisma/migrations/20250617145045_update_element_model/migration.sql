/*
  Warnings:

  - The values [PENCIL,RECT,CIRCLE] on the enum `ElementType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `stroke` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `x1` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `x2` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `y1` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `y2` on the `Element` table. All the data in the column will be lost.
  - Added the required column `roughStyle` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strokeFill` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strokeStyle` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ElementType_new" AS ENUM ('RECTANGLE', 'ELLIPSE', 'DIAMOND', 'LINE', 'ARROW', 'FREE_DRAW', 'TEXT', 'SELECTION');
ALTER TABLE "Element" ALTER COLUMN "type" TYPE "ElementType_new" USING ("type"::text::"ElementType_new");
ALTER TYPE "ElementType" RENAME TO "ElementType_old";
ALTER TYPE "ElementType_new" RENAME TO "ElementType";
DROP TYPE "ElementType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "stroke",
DROP COLUMN "x1",
DROP COLUMN "x2",
DROP COLUMN "y1",
DROP COLUMN "y2",
ADD COLUMN     "bgFill" TEXT,
ADD COLUMN     "fillStyle" TEXT,
ADD COLUMN     "fontFamily" TEXT,
ADD COLUMN     "fontSize" TEXT,
ADD COLUMN     "fontStyle" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "radX" DOUBLE PRECISION,
ADD COLUMN     "radY" DOUBLE PRECISION,
ADD COLUMN     "roughStyle" INTEGER NOT NULL,
ADD COLUMN     "rounded" TEXT,
ADD COLUMN     "strokeFill" TEXT NOT NULL,
ADD COLUMN     "strokeStyle" TEXT NOT NULL,
ADD COLUMN     "textAlign" TEXT,
ADD COLUMN     "toX" DOUBLE PRECISION,
ADD COLUMN     "toY" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION,
ADD COLUMN     "x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL;
