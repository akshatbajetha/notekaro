"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";

export async function getAuthUser() {
  const user = await getOrCreateUser();
  return user;
}

export async function getSketch() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const canvas = await prisma.canvas.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        elements: true,
      },
    });

    // If no canvas exists, create one
    if (!canvas) {
      return await prisma.canvas.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        include: {
          elements: true,
        },
      });
    }

    return canvas;
  } catch (error) {
    console.log("Error while fetching canvas: ", error);
    throw new Error("Failed to fetch canvas");
  }
}

export async function updateSketch({
  elements,
  scale,
  panOffsetX,
  panOffsetY,
}: {
  elements?: {
    id: string;
    type: string;
    x1: number;
    y1: number;
    x2?: number;
    y2?: number;
    text?: string;
    points?: [number, number][];
    strokeWidth: number;
    stroke: string;
    fill?: string;
  }[];
  scale?: number;
  panOffsetX?: number;
  panOffsetY?: number;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get the user's canvas
    const canvas = await prisma.canvas.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!canvas) {
      throw new Error("Sketch not found");
    }

    // If elements are provided, update them
    if (elements) {
      // Get existing elements
      const existingElements = await prisma.element.findMany({
        where: {
          canvasId: canvas.id,
        },
      });

      // Create a map of existing elements by id for quick lookup
      const existingElementsMap = new Map(
        existingElements.map((el) => [el.id, el])
      );

      // Create a map of new elements by id
      const newElementsMap = new Map(elements.map((el) => [el.id, el]));

      // Find elements to delete (exist in DB but not in new elements)
      const elementsToDelete = existingElements.filter(
        (el) => !newElementsMap.has(el.id)
      );

      // Find elements to update (exist in both but have changed)
      const elementsToUpdate = elements.filter((el) => {
        const existing = existingElementsMap.get(el.id);
        if (!existing) return false;
        return JSON.stringify(existing) !== JSON.stringify(el);
      });

      // Find elements to create (don't exist in DB)
      const elementsToCreate = elements.filter(
        (el) => !existingElementsMap.has(el.id)
      );

      // Perform the operations in a transaction
      await prisma.$transaction(async (tx) => {
        // Delete elements that no longer exist
        if (elementsToDelete.length > 0) {
          await tx.element.deleteMany({
            where: {
              id: {
                in: elementsToDelete.map((el) => el.id),
              },
            },
          });
        }

        // Update changed elements
        for (const element of elementsToUpdate) {
          await tx.element.update({
            where: { id: element.id },
            data: {
              ...element,
              type: element.type.toUpperCase() as any,
            },
          });
        }

        // Create new elements
        if (elementsToCreate.length > 0) {
          await tx.element.createMany({
            data: elementsToCreate.map((element) => ({
              ...element,
              type: element.type.toUpperCase() as any,
              canvasId: canvas.id,
            })),
          });
        }
      });
    }

    // Update canvas properties if provided
    const dataToUpdate: Record<string, number> = {};
    if (scale !== undefined) dataToUpdate.scale = scale;
    if (panOffsetX !== undefined) dataToUpdate.panOffsetX = panOffsetX;
    if (panOffsetY !== undefined) dataToUpdate.panOffsetY = panOffsetY;

    if (Object.keys(dataToUpdate).length > 0) {
      await prisma.canvas.update({
        where: {
          id: canvas.id,
        },
        data: dataToUpdate,
      });
    }

    // Return updated canvas with elements
    return await prisma.canvas.findUnique({
      where: {
        id: canvas.id,
      },
      include: {
        elements: true,
      },
    });
  } catch (error) {
    console.log("Error while updating canvas: ", error);
    throw new Error("Failed to update canvas");
  }
}
