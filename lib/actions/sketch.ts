"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";
import { ElementType } from "@prisma/client";

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
    const elements = await prisma.element.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        type: true,
        x1: true,
        y1: true,
        x2: true,
        y2: true,
        text: true,
        points: true,
        strokeWidth: true,
        stroke: true,
      },
    });

    // Format elements to match client-side structure
    const formattedElements = elements.map((element) => ({
      id: element.id,
      type: element.type.toLowerCase(),
      x1: element.x1,
      y1: element.y1,
      x2: element.x2,
      y2: element.y2,
      text: element.text,
      points: element.points as [number, number][] | null,
      options: {
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
      },
    }));

    return formattedElements;
  } catch (error) {
    console.log("Error while fetching elements: ", error);
    throw new Error("Failed to fetch elements");
  }
}

export async function updateSketch({
  elements,
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
    options: {
      strokeWidth: number;
      stroke: string;
    };
  }[];
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    if (!elements) return [];

    // Process each element
    for (const element of elements) {
      const existingElement = await prisma.element.findUnique({
        where: { id: element.id },
      });

      // Only include fields that exist in the Prisma schema
      const elementData = {
        id: element.id,
        type: element.type.toUpperCase() as ElementType,
        x1: element.x1,
        y1: element.y1,
        x2: element.x2,
        y2: element.y2,
        text: element.type.toLowerCase() === "text" ? element.text : null,
        points: element.points,
        strokeWidth: element.options.strokeWidth,
        stroke: element.options.stroke,
        userId: user.id,
      };

      if (existingElement) {
        // Update existing element
        await prisma.element.update({
          where: { id: element.id },
          data: elementData,
        });
      } else {
        // Create new element
        await prisma.element.create({
          data: elementData,
        });
      }
    }

    // Return all elements for the user
    return await prisma.element.findMany({
      where: {
        userId: user.id,
      },
    });
  } catch (error) {
    console.log("Error while updating elements: ", error);
    throw new Error("Failed to update elements");
  }
}
