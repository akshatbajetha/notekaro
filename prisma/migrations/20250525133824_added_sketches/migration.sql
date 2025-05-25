-- CreateTable
CREATE TABLE "Sketch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "panOffsetX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "panOffsetY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sketch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Element" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "text" TEXT,
    "points" JSONB,
    "color" TEXT,
    "stroke" TEXT,
    "fill" TEXT,
    "sketchId" TEXT NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sketch" ADD CONSTRAINT "Sketch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_sketchId_fkey" FOREIGN KEY ("sketchId") REFERENCES "Sketch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
