"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";
import { ElementType } from "@prisma/client";

export async function getAuthUser() {
  const user = await getOrCreateUser();
  return user;
}

export async function getShapes() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const shapes = await prisma.element.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return shapes;
  } catch (error) {
    console.log("Error while fetching shapes: ", error);
    throw new Error("Failed to fetch shapes");
  }
}

export async function createShape(shapeData: {
  type: ElementType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radX?: number;
  radY?: number;
  toX?: number;
  toY?: number;
  points?: { x: number; y: number }[];
  text?: string;
  strokeWidth?: number;
  strokeFill: string;
  bgFill?: string;
  strokeStyle?: string;
  roughStyle?: number;
  fillStyle?: string;
  rounded?: string;
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  textAlign?: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const shape = await prisma.element.create({
      data: {
        ...shapeData,
        roughStyle: shapeData.roughStyle ?? 0,
        strokeWidth: shapeData.strokeWidth ?? 1,
        strokeStyle: shapeData.strokeStyle ?? "solid",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return shape;
  } catch (error) {
    console.log("Error while creating shape: ", error);
    throw new Error("Failed to create shape");
  }
}

export async function updateShape(
  shapeId: string,
  shapeData: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radX?: number;
    radY?: number;
    toX?: number;
    toY?: number;
    points?: { x: number; y: number }[];
    text?: string;
  }
) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const shape = await prisma.element.update({
      where: {
        id: shapeId,
        userId: user.id,
      },
      data: {
        ...shapeData,
        updatedAt: new Date(),
      },
    });

    return shape;
  } catch (error) {
    console.log("Error while updating shape: ", error);
    throw new Error("Failed to update shape");
  }
}

export async function deleteShape(shapeId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const shape = await prisma.element.delete({
      where: {
        id: shapeId,
        userId: user.id,
      },
    });

    return shape;
  } catch (error) {
    console.log("Error while deleting shape: ", error);
    throw new Error("Failed to delete shape");
  }
}
